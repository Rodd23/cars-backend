import { and, ilike, type SQL } from "drizzle-orm";
import { cars } from "../../../db/schema/cars.js";
import type { CatalogQuery } from "./catalog.schema.js";

export function buildCatalogWhere(query: CatalogQuery) {
	const conditions: SQL[] = [];
	for (const key of ["brand", "model", "version"] as const) {
		const value = query[key];
		if (value) {
			// PostgreSQL LIKE uses backslash as its default escape character.
			const escaped = value.replace(/[\\%_]/g, "\\$&");
			conditions.push(ilike(cars[key], `%${escaped}%`));
		}
	}
	return and(...conditions);
}
