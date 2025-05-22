import { useState, useEffect } from 'react';
import { LoanForm } from './components/LoanForm';
import { LoanCard } from './components/LoanCard';
import { SearchBar } from './components/SearchBar';
import { Coins, PlusCircle } from 'lucide-react';
// Remove loadLoans import
import { saveLoans } from './utils/loanStorage';
import type { Loan } from './types';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch loans from MongoDB on mount
  useEffect(() => {
    async function fetchLoans() {
      if (window.electronAPI?.getLoansFromMongo) {
        const dbLoans = await window.electronAPI.getLoansFromMongo();
        setLoans(dbLoans);
      }
    }
    fetchLoans();
  }, []);

  useEffect(() => {
    saveLoans(loans);
  }, [loans]);

  const handleCreateLoan = async (loanData: Omit<Loan, 'id' | 'payments' | 'isPaid'> & { synced?: boolean }) => {
    const newLoan: Loan = {
      ...loanData,
      id: crypto.randomUUID(),
      payments: [],
      additions: [],
      isPaid: false,
      synced: loanData.synced || false,
    };

    if (newLoan.synced && window.electronAPI?.addLoanToMongo) {
      await window.electronAPI.addLoanToMongo(newLoan);
    }

    setLoans(prev => [...prev, newLoan]);
    setShowLoanForm(false);
  };

  const handleAddPayment = async (loanId: string, amount: number) => {
    let updatedLoan: Loan | undefined;
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        updatedLoan = {
          ...loan,
          payments: [...loan.payments, {
            id: crypto.randomUUID(),
            amount,
            date: new Date().toISOString()
          }]
        };
        return updatedLoan;
      }
      return loan;
    }));
    // Update in Mongo if synced
    if (updatedLoan?.synced && window.electronAPI?.updateLoanInMongo) {
      console.log(`[DEBUG] (App.tsx:67:32) window.electronAPI?.updateLoanInMongo`, window.electronAPI?.updateLoanInMongo);
      console.log(`[DEBUG] (App.tsx:67:9) updatedLoan?.synced`, updatedLoan?.synced);
      await window.electronAPI.updateLoanInMongo(updatedLoan);
    }
  };

  const handleAddMoney = async (loanId: string, amount: number) => {
    let updatedLoan: Loan | undefined;
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        updatedLoan = {
          ...loan,
          additions: [...loan.additions, {
            id: crypto.randomUUID(),
            amount,
            date: new Date().toISOString()
          }]
        };
        return updatedLoan;
      }
      return loan;
    }));
    if (updatedLoan?.synced && window.electronAPI?.updateLoanInMongo) {

      console.log(`[DEBUG] (App.tsx:67:32) window.electronAPI?.updateLoanInMongo`, window.electronAPI?.updateLoanInMongo);
      console.log(`[DEBUG] (App.tsx:67:9) updatedLoan?.synced`, updatedLoan?.synced);
      await window.electronAPI.updateLoanInMongo(updatedLoan);
    }
  };

  const handleMarkPaid = (loanId: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const updatedLoan = { ...loan, isPaid: true };
        if (updatedLoan.synced && window.electronAPI?.updateLoanInMongo) {
          window.electronAPI.updateLoanInMongo(updatedLoan);
        }
        return updatedLoan;
      }
      return loan;
    }));
  };

  const handlePauseLoan = (loanId: string, cycles: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const updatedLoan = { ...loan, pausedCycles: loan.pausedCycles + cycles };
        if (updatedLoan.synced && window.electronAPI?.updateLoanInMongo) {
          window.electronAPI.updateLoanInMongo(updatedLoan);
        }
        return updatedLoan;
      }
      return loan;
    }));
  };

  const handleResumeLoan = (loanId: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId && loan.pausedCycles > 0) {
        const updatedLoan = { ...loan, pausedCycles: loan.pausedCycles - 1 };
        if (updatedLoan.synced && window.electronAPI?.updateLoanInMongo) {
          window.electronAPI.updateLoanInMongo(updatedLoan);
        }
        return updatedLoan;
      }
      return loan;
    }));
  };

  const handleSyncLoan = (loanId: string) => {
    setLoans(loans =>
      loans.map(loan =>
        loan.id === loanId ? { ...loan, synced: true } : loan
      )
    );
  };

  const handleRefreshLoans = async () => {
    if (window.electronAPI?.refreshLoans) {
      const dbLoans = await window.electronAPI.refreshLoans();
      setLoans(dbLoans);
    }
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
      <header className="flex justify-between items-center max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-green-400 flex items-center gap-3">
          <Coins className="w-8 h-8 text-green-400" />
          Loan Manager
        </h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>
          <button
            className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
            onClick={handleRefreshLoans}
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
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
              onSyncLoan={handleSyncLoan}
            />
          ))}
        </div>
      </div>
      {showSettings && (
        <SettingsPage
          onClose={() => setShowSettings(false)}
          onRefresh={handleRefreshLoans}
        />
      )}
    </div>
  );
}

export default App;