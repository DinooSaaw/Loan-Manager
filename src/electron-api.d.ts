interface ElectronAPI {
  onUpdateAvailable: (callback: () => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  sendRestartApp: () => void;
  addLoanToMongo: (loan: any) => Promise<string>;
  updateLoanInMongo: (loan: any) => Promise<boolean>;
  getLoansFromMongo: () => Promise<any[]>; // Add this line
}

interface Window {
  electronAPI: ElectronAPI;
}

declare const window: Window;