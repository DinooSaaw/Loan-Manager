import type { Loan } from '../types';

export const isLoanOutdated = (loan: Loan): boolean => {
  const requiredFields = ['borrowerId', 'borrowerName', 'principal', 'interestRate', 'payments', 'additions', 'pausedCycles', 'startDate', 'interestType'];
  return requiredFields.some((field) => loan[field as keyof Loan] === undefined || loan[field as keyof Loan] === null);
};