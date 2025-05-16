import z from "zod"

export const createCustomerSchema = z.object({
    name:z.string().min(2,"Minimo duas letras"),
    email:z.string().email("Formato de email invalido"),
    cpf:z.string(),
    phone:z.string().optional(),
    userID:z.string()
})

export type createCustomerType = z.infer<typeof createCustomerSchema>