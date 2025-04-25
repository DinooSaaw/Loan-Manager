import { ipcRenderer } from 'electron';

ipcRenderer.on('update_available', () => {
  alert('A new update is available. Downloading now...');
});

ipcRenderer.on('update_downloaded', () => {
  const restart = confirm('Update downloaded. Restart the application to apply the update?');
  if (restart) {
    ipcRenderer.send('restart_app');
  }
})