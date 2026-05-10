import { useState } from 'react';

export default function SettingsModal({ onClose }) {
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [placesKey, setPlacesKey] = useState(() => localStorage.getItem('google_places_api_key') || '');
  const [saved, setSaved] = useState(false);

  function save() {
    localStorage.setItem('gemini_api_key', geminiKey.trim());
    localStorage.setItem('google_places_api_key', placesKey.trim());
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Ayarlar</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">

          <div className="settings-section">
            <div className="settings-section-title">🤖 Yapay Zeka</div>
            <label>
              Google Gemini API Key
              <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIza..." />
            </label>
            <p className="settings-hint">
              ✅ Ücretsiz · <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">aistudio.google.com</a> → Get API Key
            </p>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">🖼️ Fotoğraflar (Google Places)</div>
            <label>
              Google Places API Key
              <input type="password" value={placesKey} onChange={e => setPlacesKey(e.target.value)} placeholder="AIza..." />
            </label>
            <p className="settings-hint">
              💳 Kredi kartı gerekli · Ayda $200 ücretsiz kredi (~28.000 fotoğraf)<br />
              <a href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com" target="_blank" rel="noreferrer">
                console.cloud.google.com
              </a> → Places API (New) etkinleştir → API key oluştur<br />
              Key yoksa Wikipedia fotoğrafları kullanılır.
            </p>
          </div>

          <p className="settings-hint">🔒 Tüm keyler yalnızca tarayıcınızda saklanır.</p>

          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose}>İptal</button>
            <button className="btn-primary" onClick={save}>
              {saved ? '✓ Kaydedildi' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
