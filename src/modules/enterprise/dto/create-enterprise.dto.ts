import zod from "zod"

export const createEnterpriseDTO = zod.object({
  email:zod.string().email("Necessario um email") ,
  password:zod.string().min(8,"minimo 8 caracteres"),
  company_name: zod.string().max(45,"maximo de caracteres e 45").min(2).optional(),
  fantasy_name:zod.string().max(45,"maximo de caracteres e 45").min(2).optional(),
  cnpj:zod.string().min(14,"minimo de caracteres e 14").max(14,"maximo de caracteres e 14").optional() ,
  cpf: zod.string().min(11,"minimo de caracteres e 11").max(11,"maximo de caracteres e 11").optional(),
  contact_1:zod.string().min(15),
  contact_2:zod.string().min(15).optional()
  
})