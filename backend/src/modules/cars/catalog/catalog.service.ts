import type { cars } from "../../../db/schema/cars.js";
import type { CatalogQuery } from "./catalog.schema.js";

export type CatalogCar = typeof cars.$inferSelect;

export interface CatalogRepository {
	listCars(query: CatalogQuery): Promise<{ items: CatalogCar[]; totalItems: number }>;
	findCarById(id: string): Promise<CatalogCar | undefined>;
}

function serializeCar(car: CatalogCar) {
	return {
		...car,
		createdAt: car.createdAt.toISOString(),
		updatedAt: car.updatedAt.toISOString(),
	};
}

export class CatalogService {
	constructor(private readonly repository: CatalogRepository) {}

	async listCars(query: CatalogQuery) {
		const { items, totalItems } = await this.repository.listCars(query);
		return {
			items: items.map(serializeCar),
			pagination: {
				page: query.page,
				pageSize: query.pageSize,
				totalItems,
				totalPages: Math.ceil(totalItems / query.pageSize),
			},
		};
	}

	async findCarById(id: string) {
		const car = await this.repository.findCarById(id);
		return car ? serializeCar(car) : undefined;
	}
}
