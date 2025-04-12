import * as z from "zod"


export const loginSchema = z.object({
    email: z.string().email('O e-mail deve ser válido').min(1, 'O e-mail é obrigatório'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})