import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.electronAPI.onUpdateAvailable(() => {
  alert('A new update is available. Downloading now...');
});

window.electronAPI.onUpdateDownloaded(() => {
  const restart = confirm('Update downloaded. Restart now to apply the update?');
  if (restart) {
    window.electronAPI.sendRestartApp();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
