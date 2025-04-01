import { Loan } from '../types'; 

export const loadLoans = (): Loan[] => {
    try {
      const storedLoans = localStorage.getItem('loans');
      return storedLoans ? JSON.parse(storedLoans) : [];
    } catch (error) {
      console.error('Error loading loans:', error);
      return [];
    }
  };
  
  export const saveLoans = (loans: Loan[]) => {
    try {
      localStorage.setItem('loans', JSON.stringify(loans));
    } catch (error) {
      console.error('Error saving loans:', error);
    }
  };