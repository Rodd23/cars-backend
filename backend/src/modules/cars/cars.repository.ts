import { db } from "../../db/client.js";
import { cars } from "../../db/schema/cars.js";
import type { CreateCarInput, SearchFilters } from "./cars.schema.js";
import { buildSearchQuery } from "./search/search-query-builder.js";
import { count, desc, eq } from "drizzle-orm";
import { buildCatalogWhere } from "./catalog/catalog-query-builder.js";
import type { CatalogQuery } from "./catalog/catalog.schema.js";

export class CarsRepository {
	async listCars(query: CatalogQuery) {
		const where = buildCatalogWhere(query);
		// A single snapshot keeps the count and current page internally consistent.
		return db.transaction(async (tx) => {
			const [total] = await tx.select({ value: count() }).from(cars).where(where);
			const items = await tx.select().from(cars).where(where)
				.orderBy(desc(cars.createdAt), desc(cars.id))
				.limit(query.pageSize).offset((query.page - 1) * query.pageSize);
			return { items, totalItems: total!.value };
		}, { isolationLevel: "repeatable read", accessMode: "read only" });
	}

	async findCarById(id: string) {
		const [car] = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
		return car;
	}

	async searchCars(filters: SearchFilters) {
		try {
			const built = buildSearchQuery(filters);
			const q = db.select().from(cars);
			if (built.where) {
				return await q.where(built.where);
			}
			return await q;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Database error: ${error.message}`);
			}
			throw new Error("Unknown database error occurred");
		}
	}

	async createCar(data: CreateCarInput) {
		try {
			return await db
				.insert(cars)
				.values({
					...data,
					price: data.price.toString(),
				})
				.returning();
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Database error: ${error.message}`);
			}
			throw new Error("Unknown database error occurred");
		}
	}
}
