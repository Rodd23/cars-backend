import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import { PgDialect } from "drizzle-orm/pg-core";
import { catalogRoutes } from "../src/modules/cars/catalog/catalog.routes.js";
import { buildCatalogWhere } from "../src/modules/cars/catalog/catalog-query-builder.js";
import { catalogQuerySchema } from "../src/modules/cars/catalog/catalog.schema.js";
import type { CatalogCar, CatalogRepository } from "../src/modules/cars/catalog/catalog.service.js";

const car: CatalogCar = {
	id: "8aa4c34b-850a-4e94-af03-a522df2f4535",
	brand: "Fiat", model: "Uno", version: null, year: 2020,
	price: "50000.00", fuel: null, transmission: null, mileage: 0,
	imageUrl: null, createdAt: new Date("2026-01-01T00:00:00Z"),
	updatedAt: new Date("2026-01-02T00:00:00Z"),
};

function repository(overrides: Partial<CatalogRepository> = {}): CatalogRepository {
	return {
		listCars: async () => ({ items: [car], totalItems: 1 }),
		findCarById: async () => car,
		...overrides,
	};
}

async function buildTestApp(repo = repository()) {
	const app = Fastify();
	await app.register(catalogRoutes, { repository: repo });
	return app;
}

test("list defaults preserve decimal price, nulls, zero mileage and UTC timestamps", async (t) => {
	const app = await buildTestApp(repository({ listCars: async (query) => {
		assert.deepEqual(query, { page: 1, pageSize: 12 });
		return { items: [car], totalItems: 13 };
	} }));
	t.after(() => app.close());
	const response = await app.inject({ method: "GET", url: "/cars" });
	assert.equal(response.statusCode, 200);
	assert.deepEqual(response.json(), {
		items: [{ ...car, createdAt: car.createdAt.toISOString(), updatedAt: car.updatedAt.toISOString() }],
		pagination: { page: 1, pageSize: 12, totalItems: 13, totalPages: 2 },
	});
});

test("query rejects invalid pagination, duplicate values, empty filters and unknown keys before DB", async (t) => {
	const app = await buildTestApp(repository({ listCars: async () => { throw new Error("Must not query"); } }));
	t.after(() => app.close());
	for (const query of ["page=", "page=0", "page=-1", "page=1.5", "page=1e2", "page=Infinity",
		"pageSize=101", "pageSize=0", "page=1&page=2", "brand=", "brand=%20", "other=value",
		"page=9007199254740991&pageSize=100", `model=${"x".repeat(121)}`]) {
		const response = await app.inject({ method: "GET", url: `/cars?${query}` });
		assert.equal(response.statusCode, 400, query);
		assert.equal(response.json().error.code, "INVALID_REQUEST");
	}
});

test("filters are trimmed and passed together with pagination", async (t) => {
	const app = await buildTestApp(repository({ listCars: async (query) => {
		assert.deepEqual(query, { page: 2, pageSize: 5, brand: "Fiat", model: "Uno", version: "Fire" });
		return { items: [], totalItems: 3 };
	} }));
	t.after(() => app.close());
	const response = await app.inject({ method: "GET", url: "/cars?page=2&pageSize=5&brand=%20Fiat%20&model=Uno&version=Fire" });
	assert.equal(response.statusCode, 200);
	assert.deepEqual(response.json(), { items: [], pagination: { page: 2, pageSize: 5, totalItems: 3, totalPages: 1 } });
});

test("empty catalog has zero pages", async (t) => {
	const app = await buildTestApp(repository({ listCars: async () => ({ items: [], totalItems: 0 }) }));
	t.after(() => app.close());
	const response = await app.inject({ method: "GET", url: "/cars" });
	assert.equal(response.json().pagination.totalPages, 0);
});

test("detail distinguishes invalid id, missing vehicle and existing vehicle", async (t) => {
	let calls = 0;
	const app = await buildTestApp(repository({ findCarById: async (id) => {
		calls++;
		return id === car.id ? car : undefined;
	} }));
	t.after(() => app.close());
	assert.equal((await app.inject({ method: "GET", url: "/cars/invalid" })).statusCode, 400);
	assert.equal(calls, 0);
	const missing = await app.inject({ method: "GET", url: "/cars/99a4c34b-850a-4e94-af03-a522df2f4535" });
	assert.equal(missing.statusCode, 404);
	assert.equal(missing.json().error.code, "CAR_NOT_FOUND");
	const found = await app.inject({ method: "GET", url: `/cars/${car.id}` });
	assert.equal(found.statusCode, 200);
	assert.equal(found.json().price, "50000.00");
});

test("DB failures return safe errors for both endpoints", async (t) => {
	const fail = async () => { throw new Error("postgres://secret:password@private SELECT cars"); };
	const app = await buildTestApp(repository({ listCars: fail, findCarById: fail }));
	t.after(() => app.close());
	for (const url of ["/cars", `/cars/${car.id}`]) {
		const response = await app.inject({ method: "GET", url });
		assert.equal(response.statusCode, 500);
		assert.equal(response.json().error.code, "INTERNAL_ERROR");
		assert.doesNotMatch(response.body, /secret|password|SELECT|postgres/);
	}
});

test("SQL is parameterized, combines filters and escapes literal wildcards/backslashes", () => {
	const where = buildCatalogWhere(catalogQuerySchema.parse({ brand: "50%", model: "a_b", version: "x\\y'" }));
	assert.ok(where);
	const compiled = new PgDialect().sqlToQuery(where);
	assert.deepEqual(compiled.params, ["%50\\%%", "%a\\_b%", "%x\\\\y'%"]);
	assert.match(compiled.sql, / and /i);
	assert.doesNotMatch(compiled.sql, /50%|a_b|x\\y/);
	assert.equal(buildCatalogWhere(catalogQuerySchema.parse({})), undefined);
});
