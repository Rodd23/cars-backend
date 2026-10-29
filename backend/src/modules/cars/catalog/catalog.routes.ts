import type { FastifyInstance } from "fastify";
import { CatalogController } from "./catalog.controller.js";
import { CatalogService, type CatalogRepository } from "./catalog.service.js";

export async function catalogRoutes(
	app: FastifyInstance,
	options: { repository: CatalogRepository },
) {
	const controller = new CatalogController(new CatalogService(options.repository));
	app.get("/cars", controller.listCars.bind(controller));
	app.get("/cars/:id", controller.findCarById.bind(controller));
}
