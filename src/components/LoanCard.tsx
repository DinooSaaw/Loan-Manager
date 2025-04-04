import React, { useState } from 'react';
import { Banknote, Calendar, CheckCircle, User } from 'lucide-react';
import { calculateLoan } from '../utils/loanCalculations';
import { Loan } from '../types';

interface LoanCardProps {
  loan: Loan;
  onAddPayment: (loanId: string, amount: number) => void;
  onMarkPaid: (loanId: string) => void;
}

export function LoanCard({ loan, onAddPayment, onMarkPaid }: LoanCardProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const { currentBalance, nextBalance, daysOrWeeksPassed } = calculateLoan(loan);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment(loan.id, Number(paymentAmount));
    setPaymentAmount('');
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${loan.isPaid ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-green-400">Loan</h3>
        {loan.isPaid ? (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">Paid</span>
        ) : (
          <button
            onClick={() => onMarkPaid(loan.id)}
            className="text-green-400 hover:text-green-300"
            title="Mark as paid"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-300">
          <User className="w-5 h-5 mr-2 text-green-400" />
          <span>
            Borrower: {loan.borrowerName} <br />
            ID: {loan.borrowerId}
          </span>

        </div>

        <div className="flex items-center text-gray-300">
          <Banknote className="w-5 h-5 mr-2 text-green-400" />
          <span>Principal: ${loan.principal.toFixed(2)}</span>
        </div>

        <div className="flex items-center text-gray-300">
          <Calendar className="w-5 h-5 mr-2 text-green-400" />
          <span>Started: {new Date(loan.startDate).toLocaleDateString()}</span>
        </div>

        <div className="bg-gray-700 p-4 rounded-md space-y-2">
          <p className="text-gray-300">
            Interest Rate: {(loan.interestRate * 100).toFixed(2)}% ({loan.interestType})
          </p>
          <p className="text-gray-300">
            Time Passed: {daysOrWeeksPassed} {loan.interestType === 'daily' ? 'days' : 'weeks'}
          </p>
          <p className="text-white font-semibold">
            Current Balance: ${currentBalance.toFixed(2)}
          </p>
          <p className="text-green-400 font-semibold">
            Next {loan.interestType === 'daily' ? 'Day' : 'Week'}: ${nextBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-semibold text-green-400 mb-2">Payments</h4>
          <div className="space-y-2">
            {loan.payments.map(payment => (
              <div key={payment.id} className="flex justify-between text-gray-300">
                <span>{new Date(payment.date).toLocaleDateString()}</span>
                <span>${payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {!loan.isPaid && (
          <form onSubmit={handlePayment} className="flex gap-2">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Payment amount"
              className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white"
              step="0.01"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}