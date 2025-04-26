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
  additions: Addition[];
  isPaid: boolean;
  pausedCycles: number; // New property to track paused cycles
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Addition {
  id: string;
  amount: number;
  date: string;
}

export interface LoanCalculation {
  currentBalance: number;
  nextBalance: number;
  daysOrWeeksPassed: number;
}