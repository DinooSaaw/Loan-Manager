export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  principal: number;
  interestRate: number;
  startDate: string;
  interestType: 'daily' | 'weekly';
  description: string;
  payments: Payment[];
  isPaid: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface LoanCalculation {
  currentBalance: number;
  nextBalance: number;
  daysOrWeeksPassed: number;
}