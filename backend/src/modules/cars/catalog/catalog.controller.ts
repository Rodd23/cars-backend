import type { FastifyReply, FastifyRequest } from "fastify";
import { catalogIdSchema, catalogQuerySchema } from "./catalog.schema.js";
import type { CatalogService } from "./catalog.service.js";

export class CatalogController {
	constructor(private readonly service: CatalogService) {}

	async listCars(request: FastifyRequest, reply: FastifyReply) {
		const parsed = catalogQuerySchema.safeParse(request.query);
		if (!parsed.success) return this.invalidRequest(reply);
		try {
			return reply.send(await this.service.listCars(parsed.data));
		} catch {
			return this.internalError(request, reply);
		}
	}

	async findCarById(request: FastifyRequest, reply: FastifyReply) {
		const parsed = catalogIdSchema.safeParse(request.params);
		if (!parsed.success) return this.invalidRequest(reply);
		try {
			const car = await this.service.findCarById(parsed.data.id);
			if (!car) {
				return reply.status(404).send({ error: {
					code: "CAR_NOT_FOUND", message: "Veículo não encontrado.",
				} });
			}
			return reply.send(car);
		} catch {
			return this.internalError(request, reply);
		}
	}

	private invalidRequest(reply: FastifyReply) {
		return reply.status(400).send({ error: {
			code: "INVALID_REQUEST", message: "Parâmetros inválidos.",
		} });
	}

	private internalError(request: FastifyRequest, reply: FastifyReply) {
		// Keep correlation and operation, without logging raw DB errors or secrets.
		request.log.error({ code: "CATALOG_READ_FAILED" }, "Falha na consulta do catálogo");
		return reply.status(500).send({ error: {
			code: "INTERNAL_ERROR", message: "Não foi possível consultar o catálogo.",
		} });
	}
}
