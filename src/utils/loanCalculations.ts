export const calculateLoan = (loan: Loan): LoanCalculation => {
  const now = new Date();
  const start = new Date(loan.startDate);
  const msInDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / msInDay);
  
  const periods = loan.interestType === 'daily' 
    ? daysPassed 
    : Math.floor(daysPassed / 7);
  
  const nextPeriods = periods + 1;
  
  // Calculate total payments
  const totalPayments = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // A = P × (1 + r)^t
  const currentBalance = loan.principal * Math.pow(1 + loan.interestRate, periods) - totalPayments;
  const nextBalance = loan.principal * Math.pow(1 + loan.interestRate, nextPeriods) - totalPayments;

  return {
    currentBalance: Math.max(0, currentBalance),
    nextBalance: Math.max(0, nextBalance),
    daysOrWeeksPassed: periods
  };
};