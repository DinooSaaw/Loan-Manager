import type { Loan, LoanCalculation } from '../types';

export const calculateLoan = (loan: Loan): LoanCalculation => {
  const now = new Date();
  const start = new Date(loan.startDate);
  const msInDay = 1000 * 60 * 60 * 24;

  // Calculate number of full interest periods that have passed
  const getPeriodIndex = (date: Date): number =>
    loan.interestType === 'daily'
      ? Math.floor((date.getTime() - start.getTime()) / msInDay)
      : Math.floor((date.getTime() - start.getTime()) / (msInDay * 7));

  const currentPeriod = getPeriodIndex(now);

  // Group additions by period index
  const additionsByPeriod: Record<number, number> = {};
  for (const addition of loan.additions) {
    const period = getPeriodIndex(new Date(addition.date));
    additionsByPeriod[period] = (additionsByPeriod[period] || 0) + addition.amount;
  }

  let balance = loan.principal;

  // Apply interest and additions per period up to the current one
  for (let period = 0; period < currentPeriod; period++) {
    if (additionsByPeriod[period]) {
      balance += additionsByPeriod[period];
    }
    balance *= 1 + loan.interestRate; // Compound interest
  }

  // Apply additions for current period BEFORE calculating next period
  if (additionsByPeriod[currentPeriod]) {
    balance += additionsByPeriod[currentPeriod];
  }

  const currentBalance = balance;

  // Predict next balance by applying interest again
  const nextBalance = currentBalance * (1 + loan.interestRate);

  // Subtract total payments from both balances
  const totalPayments = loan.payments.reduce((sum, p) => sum + p.amount, 0);
  const finalCurrent = Math.max(0, currentBalance - totalPayments);
  const finalNext = Math.max(0, nextBalance - totalPayments);

  return {
    currentBalance: finalCurrent,
    nextBalance: finalNext,
    daysOrWeeksPassed: currentPeriod,
  };
};
