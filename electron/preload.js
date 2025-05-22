const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  sendRestartApp: () => ipcRenderer.send('restart_app'),
  addLoanToMongo: (loan) => ipcRenderer.invoke('mongo-add-loan', loan),
  updateLoanInMongo: (loan) => ipcRenderer.invoke('mongo-update-loan', loan),
  getLoansFromMongo: () => ipcRenderer.invoke('mongo-get-loans'),
});