import { useState } from 'react';

const CATEGORIES = {
  ulasim: { label: 'Ulaşım', icon: '✈️', color: '#3B82F6' },
  konaklama: { label: 'Konaklama', icon: '🏨', color: '#8B5CF6' },
  yemek: { label: 'Yemek', icon: '🍽️', color: '#F59E0B' },
  eglenme: { label: 'Eğlence', icon: '🎉', color: '#10B981' },
  alisveris: { label: 'Alışveriş', icon: '🛍️', color: '#EF4444' },
  diger: { label: 'Diğer', icon: '📌', color: '#6B7280' },
};

export default function BudgetPanel({ trip, store }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'diger', date: trip.startDate });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    store.addExpense(trip.id, { ...form, amount: Number(form.amount) });
    setForm({ title: '', amount: '', category: 'diger', date: trip.startDate });
    setShowForm(false);
  }

  const activityCosts = trip.days.flatMap(d =>
    d.activities.filter(a => a.cost > 0).map(a => ({
      id: 'act_' + a.id,
      title: a.title,
      amount: a.cost,
      category: a.category in CATEGORIES ? a.category : 'diger',
      date: d.date,
      fromActivity: true,
    }))
  );

  const allExpenses = [...trip.expenses, ...activityCosts];
  const totalSpent = allExpenses.reduce((s, e) => s + e.amount, 0);
  const remaining = trip.budget - totalSpent;
  const overBudget = remaining < 0 && trip.budget > 0;

  const byCategory = {};
  for (const e of allExpenses) {
    const cat = e.category in CATEGORIES ? e.category : 'diger';
    byCategory[cat] = (byCategory[cat] || 0) + e.amount;
  }

  return (
    <div className="budget-panel">
      <div className="budget-overview">
        <div className="budget-stat">
          <div className="budget-stat-label">Toplam Bütçe</div>
          <div className="budget-stat-value">{trip.budget > 0 ? trip.budget.toLocaleString('tr-TR') : '—'} {trip.currency}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">Harcanan</div>
          <div className="budget-stat-value spent">{totalSpent.toLocaleString('tr-TR')} {trip.currency}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">{overBudget ? 'Aşım' : 'Kalan'}</div>
          <div className={`budget-stat-value ${overBudget ? 'over' : 'remaining'}`}>
            {Math.abs(remaining).toLocaleString('tr-TR')} {trip.currency}
          </div>
        </div>
      </div>

      {trip.budget > 0 && (
        <div className="budget-bar-full">
          <div className="budget-bar-fill-full" style={{
            width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%`,
            background: overBudget ? '#EF4444' : '#10B981',
          }} />
        </div>
      )}

      <div className="category-breakdown">
        <h3>Kategori Dağılımı</h3>
        <div className="category-bars">
          {Object.entries(byCategory).map(([cat, amount]) => {
            const info = CATEGORIES[cat];
            const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            return (
              <div key={cat} className="cat-bar-row">
                <span className="cat-icon">{info.icon}</span>
                <span className="cat-label">{info.label}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${pct}%`, background: info.color }} />
                </div>
                <span className="cat-amount">{amount.toLocaleString('tr-TR')} {trip.currency}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="expense-section">
        <div className="expense-section-header">
          <h3>Harcamalar</h3>
          <button className="btn-primary" onClick={() => setShowForm(s => !s)}>+ Harcama Ekle</button>
        </div>

        {showForm && (
          <form className="expense-form" onSubmit={submit}>
            <div className="form-row">
              <label style={{ flex: 2 }}>
                Açıklama *
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="ör. Otobüs bileti" required />
              </label>
              <label>
                Tutar ({trip.currency}) *
                <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" min="0" required />
              </label>
              <label>
                Kategori
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Tarih
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>İptal</button>
              <button type="submit" className="btn-primary">Kaydet</button>
            </div>
          </form>
        )}

        <div className="expense-list">
          {allExpenses.length === 0 && <p className="empty-text">Henüz harcama yok.</p>}
          {allExpenses.map(exp => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.diger;
            return (
              <div key={exp.id} className="expense-item">
                <span className="exp-icon">{cat.icon}</span>
                <div className="exp-body">
                  <div className="exp-title">{exp.title}</div>
                  <div className="exp-meta">{cat.label} · {formatDate(exp.date)}{exp.fromActivity ? ' · Aktiviteden' : ''}</div>
                </div>
                <div className="exp-amount">{exp.amount.toLocaleString('tr-TR')} {trip.currency}</div>
                {!exp.fromActivity && (
                  <button className="activity-delete" onClick={() => store.deleteExpense(trip.id, exp.id)}>✕</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}
