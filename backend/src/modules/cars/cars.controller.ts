import type { FastifyReply, FastifyRequest } from "fastify";
import {
	createCarSchema,
	searchRequestSchema,
	type CreateCarInput,
	type SearchCarsRequestInput,
} from "./cars.schema.js";
import { CarsService } from "./cars.service.js";

export class CarsController {
	private carsService: CarsService;

	constructor() {
		this.carsService = new CarsService();
	}

	async createCar(request: FastifyRequest, reply: FastifyReply) {
		try {
			const validatedData = createCarSchema.parse(request.body);
			const carResult = await this.carsService.createCar(validatedData);
			return reply.status(201).send(carResult[0]);
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				return reply.status(400).send({
					error: "Validation error",
					details: (error as any).errors,
				});
			}
			if (error instanceof Error) {
				return reply.status(500).send({
					error: "Failed to create car",
					message: error.message,
				});
			}
			return reply.status(500).send({
				error: "An unexpected error occurred",
			});
		}
	}

	async searchCars(
		request: FastifyRequest<{ Body: SearchCarsRequestInput }>,
		reply: FastifyReply,
	) {
		try {
			const validatedData = searchRequestSchema.parse(request.body);
			const cars = await this.carsService.searchCars(validatedData);
			return reply.status(200).send(cars);
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				return reply.status(400).send({
					error: "Validation error",
					details: (error as any).errors,
				});
			}
			if (error instanceof Error) {
				return reply.status(500).send({
					error: "Failed to search cars",
					message: error.message,
				});
			}
			return reply.status(500).send({
				error: "An unexpected error occurred",
			});
		}
	}
}
