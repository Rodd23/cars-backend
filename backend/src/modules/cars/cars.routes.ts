import type { FastifyInstance } from "fastify";
import { CarsController } from "./cars.controller.js";
import { CarsRepository } from "./cars.repository.js";
import { catalogRoutes } from "./catalog/catalog.routes.js";

const carsController = new CarsController();

export async function carsRoutes(app: FastifyInstance) {
	await app.register(catalogRoutes, { repository: new CarsRepository() });
	app.post("/cars", carsController.createCar.bind(carsController));
	app.post("/cars/search", carsController.searchCars.bind(carsController));
}
