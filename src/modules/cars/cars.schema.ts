import z from "zod";

export const createCarSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    version: z.string().min(1).optional(),
    year: z.number().int().min(1886, "Year must be greater than or equal to 1886"),
    price: z.number().int().positive("Price must be a positive number"),
    fuel: z.string().min(1),
    transmission: z.string().min(1),
    mileage: z.number().int().min(0),
    imageUrl: z.string().trim().url("Image URL must be a valid URL").optional(),
});

export const searchRequestSchema = z.object({
    search: z.string().min(1, "Search query is required"),
});

export const filtersSchema = z.object({
    brand: z.string().trim().min(1).optional(),
    model: z.string().trim().min(1).optional(),
    version: z.string().trim().min(1).max(120).optional(),
});

export type SearchCarsRequestInput = z.infer<typeof searchRequestSchema>;
export type CreateCarInput = z.infer<typeof createCarSchema>;
export type SearchFilters = z.infer<typeof filtersSchema>;