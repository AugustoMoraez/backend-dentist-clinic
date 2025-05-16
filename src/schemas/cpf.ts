import { z } from "zod";

const cpfValidator = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica CPFs repetidos
  const digits = cpf.split('').map(Number);
  const checkDigits = (start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += digits[i] * (end + 1 - i); // <- nota: end+1 aqui é o peso certo
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const firstCheckDigit = checkDigits(0, 9);
  const secondCheckDigit = checkDigits(0, 10);
  return digits[9] === firstCheckDigit && digits[10] === secondCheckDigit;
};

export const cpf = z.string().refine(cpfValidator, {
  message: 'CPF inválido',
});