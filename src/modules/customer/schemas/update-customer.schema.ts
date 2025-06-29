import { AddressSchema } from "src/schemas/address";
import { z } from "zod";

export const updateCustomerSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  cpf: z.string().min(11).max(11).optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

export type UpdateCustomerType = z.infer<typeof updateCustomerSchema>;
