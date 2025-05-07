import * as z from "zod"


export const resetPasswordSchema = z.object({
   token:z.string().min(1,"deve ter um token"),
   newPassword:z.string().min(8, "deve ter no minimo 8 caracteres")
})
export type resetPasswordType = z.infer<typeof resetPasswordSchema>

