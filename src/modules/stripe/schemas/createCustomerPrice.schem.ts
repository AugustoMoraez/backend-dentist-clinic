import z  from "zod"

export const createPriceSchema = z.object({
    unit_amount:z.number(),
    stripeAccount:z.string(),
    product:z.string(),
}) 
export type createPriceType = z.infer<typeof createPriceSchema>