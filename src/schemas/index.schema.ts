import { z } from "zod";
import { filterSchema } from "./user.schema";

export const paramsSchema = z.object({
    page: z.number().int().positive().default(1),
    perPage: z.number().int().positive().default(10),
    sort: z.string().optional(),
    search: z.string().optional(),
    filters: filterSchema.optional(),
})

export type ParamsSchemaFormValues = z.infer<typeof paramsSchema>