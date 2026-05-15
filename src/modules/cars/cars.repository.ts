import { db } from "../../db/client.js";
import { cars } from "../../db/schema/cars.js";
import type { CreateCarInput, SearchFilters } from "./cars.schema.js";
import { buildSearchQuery } from "./search/search-query-builder.js";

export class CarsRepository {
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
