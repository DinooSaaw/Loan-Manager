import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'electron-updater';
import { MongoClient } from 'mongodb';

const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

let mongoUri = '';
let dbName = '';
let collectionName = '';

let db, collection;

async function connectMongo() {
  if (!db) {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection(collectionName);
  }
}

ipcMain.handle('mongo-add-loan', async (event, loan) => {
  await connectMongo();
  const result = await collection.insertOne(loan);
  return result.insertedId;
});

ipcMain.handle('mongo-update-loan', async (event, loan) => {
  await connectMongo();
  // Remove _id if present
  const { _id, ...loanWithoutId } = loan;
  await collection.updateOne({ id: loan.id }, { $set: loanWithoutId }, { upsert: true });
  return true;
});

ipcMain.handle('mongo-get-loans', async () => {
  await connectMongo();
  const loans = await collection.find({}).toArray();
  return loans;
});

ipcMain.handle('get-mongo-settings', () => {
  return { mongoUri, dbName, collectionName };
});

ipcMain.handle('set-mongo-settings', async (event, settings) => {
  mongoUri = settings.mongoUri;
  dbName = settings.dbName;
  collectionName = settings.collectionName;
  db = undefined; // Force reconnect with new settings
  return true;
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', process.platform === 'darwin' ? 'icon.icns' : 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the local development server or the built files
  let title = "Loan Manager"
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.title = `${title} -Dev`;
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }


  // Listen for update events
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });
}

app.whenReady().then(() => {
  createWindow();

  // Check for updates
  if (!isDev) {
    console.log("Checking for updates")
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});