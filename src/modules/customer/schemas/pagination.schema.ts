import z from "zod"

export const PaginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 0)),
     search: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
});

export type PaginationQueryDto = z.infer<typeof PaginationQuerySchema>;