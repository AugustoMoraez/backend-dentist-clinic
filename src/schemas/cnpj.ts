import { z } from "zod";

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
  const secondCheckDigit = checkDigits(0, 13, multipliers2); // <- corrigido aqui
  return digits[12] === firstCheckDigit && digits[13] === secondCheckDigit;
};

export const cnpj = z.string().refine(cnpjValidator, {
  message: 'CNPJ inválido',
});
