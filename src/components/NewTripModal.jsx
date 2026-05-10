import { useState } from 'react';
import { generateTripPlan } from '../ai/planTrip';

export default function NewTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'TRY',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPlan, setAiPlan] = useState(null);

  const hasApiKey = !!localStorage.getItem('gemini_api_key');

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setAiPlan(null);
  }

  const canAi = form.destination && form.startDate && form.endDate;

  async function handleAiPlan() {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setAiError('Önce Ayarlar\'dan Gemini API key ekleyin.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    setAiPlan(null);
    try {
      const plan = await generateTripPlan({
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget) || 0,
        currency: form.currency,
        apiKey,
      });
      setAiPlan(plan);
      if (!form.title) {
        setForm(f => ({ ...f, title: form.destination + ' Gezisi' }));
      }
    } catch (e) {
      setAiError('AI planı oluşturulamadı: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.destination || !form.startDate || !form.endDate) return;
    onCreate({
      ...form,
      budget: Number(form.budget) || 0,
      aiPlan,
    });
  }

  const dayCount = form.startDate && form.endDate
    ? Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Gezi Oluştur</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="modal-form">
          <div className="form-row">
            <label style={{ flex: 2 }}>
              Destinasyon *
              <input value={form.destination} onChange={e => set('destination', e.target.value)}
                placeholder="ör. Roma, İtalya" required />
            </label>
            <label style={{ flex: 1 }}>
              Para Birimi
              <select value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option>TRY</option><option>USD</option><option>EUR</option><option>GBP</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Başlangıç *
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
            </label>
            <label>
              Bitiş *
              <input type="date" value={form.endDate} min={form.startDate} onChange={e => set('endDate', e.target.value)} required />
            </label>
            <label>
              Bütçe
              <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="0" min="0" />
            </label>
          </div>

          {/* AI Plan butonu */}
          {canAi && (
            <div className="ai-section">
              <button type="button" className="btn-ai" onClick={handleAiPlan} disabled={aiLoading}>
                {aiLoading
                  ? <><span className="spinner" /> Plan oluşturuluyor…</>
                  : <>✨ {dayCount} günlük AI planı oluştur</>}
              </button>
              {!hasApiKey && (
                <p className="ai-hint">API key gerekli → Ayarlar &gt; Anthropic API Key</p>
              )}
              {aiError && <p className="ai-error">{aiError}</p>}
            </div>
          )}

          {/* AI plan özeti */}
          {aiPlan && (
            <div className="ai-preview">
              <div className="ai-preview-header">✅ AI Planı Hazır</div>
              <div className="ai-preview-stats">
                <span>📅 {aiPlan.days.length} gün</span>
                <span>🎯 {aiPlan.days.reduce((s, d) => s + d.activities.length, 0)} aktivite</span>
                <span>💰 {aiPlan.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString('tr-TR')} {form.currency} tahmini</span>
              </div>
              {aiPlan.tips?.length > 0 && (
                <ul className="ai-tips">
                  {aiPlan.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
            </div>
          )}

          <label>
            Gezi Adı *
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="ör. Yaz Tatili 2026" required />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>İptal</button>
            <button type="submit" className="btn-primary">
              {aiPlan ? 'AI Planıyla Oluştur 🚀' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
