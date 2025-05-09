import { useState, useEffect } from 'react';
import { LoanForm } from './components/LoanForm';
import { LoanCard } from './components/LoanCard';
import { SearchBar } from './components/SearchBar';
import { Coins, PlusCircle } from 'lucide-react';
import { loadLoans, saveLoans } from './utils/loanStorage';
import type { Loan } from './types';

function App() {
  const [loans, setLoans] = useState<Loan[]>(() => loadLoans());
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    saveLoans(loans);
  }, [loans]);

  const handleCreateLoan = (loanData: Omit<Loan, 'id' | 'payments' | 'isPaid'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: crypto.randomUUID(),
      payments: [],
      additions: [],
      isPaid: false
    };
    setLoans(prev => [...prev, newLoan]);
    setShowLoanForm(false);
  };

  const handleAddPayment = (loanId: string, amount: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          payments: [...loan.payments, {
            id: crypto.randomUUID(),
            amount,
            date: new Date().toISOString()
          }]
        };
      }
      return loan;
    }));
  };

  const handleAddMoney = (loanId: string, amount: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          additions: [...loan.additions, {
            id: crypto.randomUUID(),
            amount,
            date: new Date().toISOString()
          }]
        };
      }
      return loan;
    }));
  };

  const handleMarkPaid = (loanId: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, isPaid: true };
      }
      return loan;
    }));
  };

  const handlePauseLoan = (loanId: string, cycles: number) => {
    setLoans(prev =>
      prev.map(loan =>
        loan.id === loanId ? { ...loan, pausedCycles: loan.pausedCycles + cycles } : loan
      )
    );
  };

  const handleResumeLoan = (loanId: string) => {
    setLoans(prev =>
      prev.map(loan =>
        loan.id === loanId && loan.pausedCycles > 0
          ? { ...loan, pausedCycles: loan.pausedCycles - 1 }
          : loan
      )
    );
  };

  const filteredLoans = loans.filter(loan => {
    const searchLower = searchTerm.toLowerCase();

    // Show unpaid loans or paid loans only if there is a search term
    if (!loan.isPaid || searchTerm.trim() !== '') {
      return (
        loan.id.toLowerCase().includes(searchLower) ||
        loan.borrowerName.toLowerCase().includes(searchLower) ||
        loan.borrowerId.toLowerCase().includes(searchLower)
      );
    }

    return false;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Coins className="w-8 h-8 text-green-400 mr-3" />
          <h1 className="text-3xl font-bold text-green-400">Loan Manager</h1>
        </div>

        <div className="mb-8">
          {showLoanForm ? (
            <LoanForm 
              onSubmit={handleCreateLoan} 
              onCancel={() => setShowLoanForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowLoanForm(true)}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Create New Loan
            </button>
          )}
        </div>

        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredLoans.map(loan => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onAddPayment={handleAddPayment}
              onAddMoney={handleAddMoney}
              onMarkPaid={handleMarkPaid}
              onPauseLoan={handlePauseLoan}
              onResumeLoan={handleResumeLoan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;