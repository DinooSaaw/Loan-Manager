import { useState, useEffect } from 'react';

export function SettingsPage({ onClose, onRefresh }) {
  const [settings, setSettings] = useState({ mongoUri: '', dbName: '', collectionName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getMongoSettings().then(setSettings).finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    await window.electronAPI.setMongoSettings(settings);
    alert('Settings saved! You may need to refresh.');
    onClose();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-white">MongoDB Settings</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <label className="text-gray-300">
          Mongo URI:
          <input
            className="w-full p-2 rounded bg-gray-800 text-white mt-1"
            name="mongoUri"
            value={settings.mongoUri}
            onChange={handleChange}
          />
        </label>
        <label className="text-gray-300">
          Database Name:
          <input
            className="w-full p-2 rounded bg-gray-800 text-white mt-1"
            name="dbName"
            value={settings.dbName}
            onChange={handleChange}
          />
        </label>
        <label className="text-gray-300">
          Collection Name:
          <input
            className="w-full p-2 rounded bg-gray-800 text-white mt-1"
            name="collectionName"
            value={settings.collectionName}
            onChange={handleChange}
          />
        </label>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
          <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={onClose}>Cancel</button>
          <button type="button" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto" onClick={onRefresh}>Refresh Loans</button>
        </div>
      </form>
    </div>
  );
}