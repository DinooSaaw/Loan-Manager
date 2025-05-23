import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Loan } from '../types';

interface LoanFormProps {
  onSubmit: (loan: Omit<Loan, 'id' | 'payments' | 'isPaid'>) => void;
  onCancel: () => void;
}

export function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const [formData, setFormData] = useState({
    borrowerId: '',
    borrowerName: '',
    principal: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
    interestType: 'weekly',
    description: '',
    syncWithDb: false, // Add this
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loanData: Omit<Loan, 'id' | 'payments' | 'isPaid'> = {
      borrowerId: formData.borrowerId,
      borrowerName: formData.borrowerName,
      principal: Number(formData.principal),
      interestRate: Number(formData.interestRate) / 100,
      startDate: formData.startDate,
      interestType: formData.interestType as 'daily' | 'weekly',
      description: formData.description.trim() || '', // Ensure description is always included
      additions: [], // Provide a default empty array for additions
      pausedCycles: 0, // Provide a default value for pausedCycles
      synced: formData.syncWithDb,
    };

    onSubmit(loanData);

    setFormData({
      borrowerId: '',
      borrowerName: '',
      principal: '',
      interestRate: '',
      startDate: new Date().toISOString().split('T')[0],
      interestType: 'weekly',
      description: '',
      syncWithDb: false, // Reset syncWithDb
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Create New Loan</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">ID</label>
          <input
            type="text"
            value={formData.borrowerId}
            onChange={(e) => setFormData({ ...formData, borrowerId: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Borrower Name</label>
          <input
            type="text"
            value={formData.borrowerName}
            onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Principal Amount</label>
          <input
            type="number"
            value={formData.principal}
            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Interest Rate (%)</label>
          <input
            type="number"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Interest Type</label>
          <select
            value={formData.interestType}
            onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.syncWithDb}
            onChange={e => setFormData({ ...formData, syncWithDb: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-300">Sync with database</label>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Loan
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
