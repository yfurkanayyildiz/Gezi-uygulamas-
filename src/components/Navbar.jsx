import { useState } from 'react';
import SettingsModal from './SettingsModal';

export default function Navbar({ onNewTrip }) {
  const [showSettings, setShowSettings] = useState(false);
  const hasKey = !!localStorage.getItem('gemini_api_key');

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">✈️</span>
          <span className="navbar-title">Seyahat Planlayıcı</span>
          {hasKey && <span className="ai-badge">✨ AI Aktif</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => setShowSettings(true)}>⚙️ Ayarlar</button>
          <button className="btn-primary" onClick={onNewTrip}>+ Yeni Gezi</button>
        </div>
      </nav>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
