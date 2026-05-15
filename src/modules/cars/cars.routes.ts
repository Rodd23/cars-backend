import type { FastifyInstance } from "fastify";
import { CarsController } from "./cars.controller.js";

const carsController = new CarsController();

export async function carsRoutes(app: FastifyInstance) {
	app.post("/cars", carsController.createCar.bind(carsController));
	app.post("/cars/search", carsController.searchCars.bind(carsController));
}
