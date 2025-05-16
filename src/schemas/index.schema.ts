import { z } from "zod";
import { UserFilterSchema} from "./user.schema";
import { hospitalFilterSchema } from "./hospital.schema";
import { serviceFilterSchema } from "./service.schema";

export const paramsSchema = z.object({
    page: z.number().int().positive().default(1),
    perPage: z.number().int().positive().default(10),
    sort: z.string().optional(),
    search: z.string().optional(),
    filters: z.union([UserFilterSchema, hospitalFilterSchema, serviceFilterSchema]).optional(),
})

export type ParamsSchemaFormValues = z.infer<typeof paramsSchema>