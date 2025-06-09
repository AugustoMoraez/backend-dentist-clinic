import z from "zod"

export const createSignatureSchema = z.object({
    name:z.string(),
    description:z.string(),
    stripeAccount:z.string(),
    unit_amount:z.number()
})

export type createSignatureType=z.infer<typeof createSignatureSchema>