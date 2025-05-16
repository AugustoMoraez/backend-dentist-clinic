import { z } from "zod";

 
export const AddressSchema = z.object({
  house_number: z.string().min(1, 'O número da casa é obrigatório'),
  street: z.string().min(1, 'A rua é obrigatória'),
  district: z.string().min(1, 'O bairro é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().min(1, 'O estado é obrigatório'),
  complement: z.string().optional(),
});
 