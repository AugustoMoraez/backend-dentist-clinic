import z  from "zod"

export const createProductSchema = z.object({
    name:z.string(),
    description:z.string(),
    stripeAccount:z.string(),
}) 
export type createProductType = z.infer<typeof createProductSchema>