interface ElectronAPI {
  onUpdateAvailable: (callback: () => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  sendRestartApp: () => void;
}

interface Window {
  electronAPI: ElectronAPI;
}

declare const window: Window;