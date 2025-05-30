import { cpf } from "src/schemas/cpf"
import z from "zod"
 

export const createCustomerSchema = z.object({
    email: z.string().email("Email inválido"),
    cpf:cpf,
    name:z.string().min(2,"minimo de dois caracteres").max(40,"maximo de 40 caracteres")
})

export type createCustomerType = z.infer<typeof createCustomerSchema>