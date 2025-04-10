import { z } from 'zod';
 

const cpfValidator = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica CPFs repetidos
  const digits = cpf.split('').map(Number);
  const checkDigits = (start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += digits[i] * (end - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const firstCheckDigit = checkDigits(0, 9);
  const secondCheckDigit = checkDigits(1, 10);
  return digits[9] === firstCheckDigit && digits[10] === secondCheckDigit;
};

export const cpf = z.string().refine(cpfValidator, {
  message: 'CPF inválido',
});

 
const cnpjValidator = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false; // Verifica CNPJs repetidos
  const digits = cnpj.split('').map(Number);
  const checkDigits = (start: number, end: number, multipliers: number[]) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += digits[i] * multipliers[i - start];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const multipliers1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const multipliers2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstCheckDigit = checkDigits(0, 12, multipliers1);
  const secondCheckDigit = checkDigits(1, 13, multipliers2);
  return digits[12] === firstCheckDigit && digits[13] === secondCheckDigit;
};

export const cnpj = z.string().refine(cnpjValidator, {
  message: 'CNPJ inválido',
});

 
export const AddressSchema = z.object({
  house_number: z.string().min(1, 'O número da casa é obrigatório'),
  street: z.string().min(1, 'A rua é obrigatória'),
  district: z.string().min(1, 'O bairro é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  state: z.string().min(1, 'O estado é obrigatório'),
  complement: z.string().optional(),
});
 
export const createEnterpriseSchema = z.object({
  email: z.string().email('O e-mail deve ser válido').min(1, 'O e-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  company_name: z.string().optional(),
  fantasy_name: z.string().optional(),
  cnpj: cnpj.optional(),
  cpf: cpf.optional(),
  contact_1: z.string().min(1, 'O contato 1 é obrigatório'),
  contact_2: z.string().optional(),
  address: AddressSchema.optional(),  
});
