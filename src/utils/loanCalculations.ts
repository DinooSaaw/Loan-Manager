import type { Loan, LoanCalculation } from '../types';

export const calculateLoan = (loan: Loan): LoanCalculation => {
  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;

  const calcPeriods = (fromDate: Date): number => {
    const daysPassed = Math.floor((now.getTime() - fromDate.getTime()) / msInDay);
    return loan.interestType === 'daily' ? daysPassed : Math.floor(daysPassed / 7);
  };

  // Start with principal
  const start = new Date(loan.startDate);
  const initialPeriods = calcPeriods(start);
  let currentBalance = loan.principal * Math.pow(1 + loan.interestRate, initialPeriods);
  let nextBalance = loan.principal * Math.pow(1 + loan.interestRate, initialPeriods + 1);

  // Apply interest on each addition from its own date
  for (const addition of loan.additions) {
    const additionDate = new Date(addition.date); // You need a `date` field in additions
    const additionPeriods = calcPeriods(additionDate);
    currentBalance += addition.amount * Math.pow(1 + loan.interestRate, additionPeriods);
    nextBalance += addition.amount * Math.pow(1 + loan.interestRate, additionPeriods + 1);
  }

  // Subtract all payments
  const totalPayments = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  currentBalance -= totalPayments;
  nextBalance -= totalPayments;

  return {
    currentBalance: Math.max(0, currentBalance),
    nextBalance: Math.max(0, nextBalance),
    daysOrWeeksPassed: initialPeriods
  };
};
