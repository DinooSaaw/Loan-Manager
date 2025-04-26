import React, { useState } from 'react';
import { Banknote, Calendar, CheckCircle, User, FilePen, BellRing  } from 'lucide-react';
import { calculateLoan } from '../utils/loanCalculations';
import type { Loan } from '../types';
import { generateLoanNotice, generateLoanReminder, generatePauseNotice, generateResumeNotice } from '../utils/Notice'
import { isLoanOutdated } from '../utils/loanValidation';

interface LoanCardProps {
  loan: Loan;
  onAddPayment: (loanId: string, amount: number) => void;
  onAddMoney: (loanId: string, amount: number) => void;
  onMarkPaid: (loanId: string) => void;
  onPauseLoan: (loanId: string, cycles: number) => void;
  onResumeLoan: (loanId: string) => void; // New prop
}

export function LoanCard({ loan, onAddPayment, onAddMoney, onMarkPaid, onPauseLoan, onResumeLoan }: LoanCardProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [additionAmount, setAdditionAmount] = useState('');
  const { currentBalance, nextBalance, daysOrWeeksPassed } = calculateLoan(loan);
  const isOutdated = isLoanOutdated(loan);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment(loan.id, Number(paymentAmount));
    setPaymentAmount('');
  };

  const CreateNotice = (loan: Loan) => {
    console.log(loan)
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });


    // Example usage
    generateLoanNotice({
      recipientName: loan.borrowerName,
      lenderName: "Riley",
      startDate: loan.startDate,
      date: formattedDate,
      originalAmount: loan.principal,
      previousBalance: currentBalance,
      interestRate: (loan.interestRate * 100).toFixed(2),
      newBalance: nextBalance,
      fileName: `Notice ${loan.borrowerName} ${formattedDate}.pdf`
    });
  }

  const CreateReminder = (loan: Loan) => {
    console.log(loan)
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });


    generateLoanReminder({
      recipientName: loan.borrowerName,
      lenderName: "Riley",
      startDate: loan.startDate,
      date: formattedDate,
      originalAmount: loan.principal,
      previousBalance: currentBalance,
      interestRate: (loan.interestRate * 100).toFixed(2),
      newBalance: nextBalance,
      fileName: `Reminder ${loan.borrowerName} ${formattedDate}.pdf`
    });
  }

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMoney(loan.id, Number(additionAmount));
    setAdditionAmount('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
      {isOutdated && (
  <span
    className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
    title="This loan is missing required data."
    style={{ transform: 'translate(-50%, -50%)', left: '50%' }}
  >
    Outdated
  </span>
)}

      <div className="flex justify-between items-start mb-4">

      <div className="flex gap-2">
      <button
      onClick={() => CreateReminder(loan)}
      className="text-green-400 hover:text-blue-300"
      title="Create Reminder"
      >
      <BellRing className="w-5 h-5" />
      </button>
      <button
      onClick={() => CreateNotice(loan)}
      className="text-green-400 hover:text-blue-300"
      title="Create Notice"
      >
      <FilePen className="w-5 h-5" />
      </button>
      </div>

      <h3 className="text-xl font-bold text-green-400">{loan.description}</h3>
      {loan.isPaid ? (
      <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">Paid</span>
      ) : (
      <button
      onClick={() => onMarkPaid(loan.id)}
      className="text-green-400 hover:text-blue-300"
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
      Borrower: {loan.borrowerName}
      <div>
        ID: {loan.borrowerId}
      </div>
      </span>
      </div>

      <div className="flex items-center text-gray-300">
      <Banknote className="w-5 h-5 mr-2 text-green-400" />
      <span>Principal: ${(loan.principal.toFixed(2))}</span>
      </div>

      <div className="flex items-center text-gray-300">
      <Calendar className="w-5 h-5 mr-2 text-green-400" />
      <span>
      Started: {(() => {
        const parsedDate = new Date(loan.startDate);
        return isNaN(parsedDate.getTime())
        ? 'Invalid Date'
        : parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        });
      })()}
      </span>
      </div>

      <div className="bg-gray-700 p-4 rounded-md space-y-2">
      <p className="text-gray-300">
      Interest Rate: {(loan.interestRate * 100).toFixed(2)}% ({loan.interestType})
      </p>
      <p className="text-gray-300">
      Time Passed: {isNaN(daysOrWeeksPassed) 
        ? 'Invalid Date' 
        : `${daysOrWeeksPassed} ${loan.interestType === 'daily' ? 'days' : 'weeks'}`}
      </p>
      <p className="text-white font-semibold">
      Current Balance: ${currentBalance.toFixed(2)}
      </p>
      <p className="text-green-400 font-semibold">
      Next {loan.interestType === 'daily' ? 'Day' : 'Week'}: ${nextBalance.toFixed(2)}
      </p>
      </div>

      <div className="bg-gray-700 p-4 rounded-md">
      <h4 className="text-lg font-semibold text-green-400 mb-2">Additions to Principal</h4>
      <div className="space-y-2">
      {loan.additions.map(addition => (
        <div key={addition.id} className="flex justify-between text-gray-300">
        <span>{new Date(addition.date).toLocaleDateString()}</span>
        <span>+${addition.amount.toFixed(2)}</span>
        </div>
      ))}
      </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-md">
      <h4 className="text-lg font-semibold text-green-400 mb-2">Payments</h4>
      <div className="space-y-2">
      {loan.payments.map(payment => (
        <div key={payment.id} className="flex justify-between text-gray-300">
        <span>{new Date(payment.date).toLocaleDateString()}</span>
        <span>-${payment.amount.toFixed(2)}</span>
        </div>
      ))}
      </div>
      </div>

      {!loan.isPaid && (
      <div className="space-y-4">
      <form onSubmit={handleAddMoney} className="flex gap-2">
        <input
        type="number"
        value={additionAmount}
        onChange={(e) => setAdditionAmount(e.target.value)}
        placeholder="Amount to add to principal"
        className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white"
        step="0.01"
        required
        />
        <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
        Add to Principal
        </button>
      </form>

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
        Make Payment
        </button>
      </form>
      </div>
      )}
      </div>
      {loan.pausedCycles === 0 && (
      <button
      onClick={() => {
      onPauseLoan(loan.id, 1); // Pause for 1 cycle
      generatePauseNotice({
        recipientName: loan.borrowerName,
        lenderName: 'Riley',
        date: new Date().toLocaleDateString(),
        cyclesPaused: 1,
        interestType: loan.interestType,
      });
      }}
      className="text-yellow-400 hover:text-yellow-300"
      >
      Pause Loan
      </button>
      )}
      {loan.pausedCycles > 0 && (
      <button
      onClick={() => {
      onResumeLoan(loan.id);
      generateResumeNotice({
        recipientName: loan.borrowerName,
        lenderName: 'Riley',
        date: new Date().toLocaleDateString(),
        originalAmount: loan.principal,
        interestRate: (loan.interestRate * 100).toFixed(2),
        startDate: loan.startDate,
      });
      }}
      className="text-blue-400 hover:text-blue-300 ml-4"
      >
      Resume Loan
      </button>
      )}
    </div>
  );
}