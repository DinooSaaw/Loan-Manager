import type { Loan, LoanCalculation } from '../types';

export const calculateLoan = (loan: Loan): LoanCalculation => {
  const now = new Date();
  const start = new Date(loan.startDate);
  const msInDay = 1000 * 60 * 60 * 24;

  const getPeriodIndex = (date: Date): number =>
    loan.interestType === 'daily'
      ? Math.floor((date.getTime() - start.getTime()) / msInDay)
      : Math.floor((date.getTime() - start.getTime()) / (msInDay * 7));

  const currentPeriod = getPeriodIndex(now);

  // Adjust for paused cycles
  const effectivePeriod = Math.max(0, currentPeriod - loan.pausedCycles);

  const additionsByPeriod: Record<number, number> = {};
  for (const addition of loan.additions) {
    const period = getPeriodIndex(new Date(addition.date));
    additionsByPeriod[period] = (additionsByPeriod[period] || 0) + addition.amount;
  }

  let balance = loan.principal;

  for (let period = 0; period < effectivePeriod; period++) {
    if (additionsByPeriod[period]) {
      balance += additionsByPeriod[period];
    }
    balance *= 1 + loan.interestRate;
  }

  if (additionsByPeriod[effectivePeriod]) {
    balance += additionsByPeriod[effectivePeriod];
  }

  const currentBalance = balance;
  const nextBalance = currentBalance * (1 + loan.interestRate);

  const totalPayments = loan.payments.reduce((sum, p) => sum + p.amount, 0);
  return {
    currentBalance: Math.max(0, currentBalance - totalPayments),
    nextBalance: Math.max(0, nextBalance - totalPayments),
    daysOrWeeksPassed: effectivePeriod,
  };
};
