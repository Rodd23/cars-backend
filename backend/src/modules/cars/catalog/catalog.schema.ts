import { z } from "zod";

const positiveQueryInteger = z.string()
	.regex(/^[0-9]+$/)
	.transform(Number)
	.pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER));

export const catalogQuerySchema = z.strictObject({
	page: positiveQueryInteger.default(1),
	pageSize: positiveQueryInteger.pipe(z.number().max(100)).default(12),
	brand: z.string().trim().min(1).max(80).optional(),
	model: z.string().trim().min(1).max(120).optional(),
	version: z.string().trim().min(1).max(120).optional(),
}).refine((query) => Number.isSafeInteger((query.page - 1) * query.pageSize), {
	message: "Pagination offset exceeds the supported range",
	path: ["page"],
});

export const catalogIdSchema = z.object({ id: z.uuid() });
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
