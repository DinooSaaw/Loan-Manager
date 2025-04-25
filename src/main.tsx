import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ipcRenderer } from 'electron'; // Import ipcRenderer

// Handle update events
ipcRenderer.on('update_available', () => {
  alert('A new update is available. Downloading now...');
});

ipcRenderer.on('update_downloaded', () => {
  const restart = confirm('Update downloaded. Restart now to apply the update?');
  if (restart) {
    ipcRenderer.send('restart_app');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
