import { useState, useEffect } from 'react';
import Itinerary from './Itinerary';
import BudgetPanel from './BudgetPanel';
import MapView from './MapView';
import { fetchImage } from '../ai/fetchImage';
import Lightbox from './Lightbox';

const TABS = ['Güzergah', 'Harita', 'Bütçe'];

export default function TripDetail({ trip, store }) {
  const [tab, setTab] = useState('Güzergah');
  const [coverUrl, setCoverUrl] = useState(null);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setCoverUrl(null);
    fetchImage(trip.destination).then(setCoverUrl);
  }, [trip.destination]);

  const totalSpent = [
    ...trip.expenses.map(e => e.amount),
    ...trip.days.flatMap(d => d.activities.map(a => a.cost || 0)),
  ].reduce((s, v) => s + v, 0);

  const pct = trip.budget > 0 ? Math.min((totalSpent / trip.budget) * 100, 100) : 0;
  const overBudget = totalSpent > trip.budget && trip.budget > 0;

  return (
    <div className="trip-detail">
      <div className="trip-cover" style={{ background: trip.coverColor }}>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={trip.destination}
            className="trip-cover-img clickable-img"
            onClick={() => setLightbox(true)}
          />
        )}
        {lightbox && coverUrl && <Lightbox src={coverUrl} alt={trip.destination} onClose={() => setLightbox(false)} />}
        <div className="trip-cover-overlay" />
        <div className="trip-cover-content">
          <h1 className="trip-detail-title">{trip.title}</h1>
          <p className="trip-detail-dest">📍 {trip.destination} &nbsp;·&nbsp; 🗓️ {formatRange(trip.startDate, trip.endDate)}</p>
          {trip.budget > 0 && (
            <div className="budget-summary">
              <div className="budget-summary-text">
                <span className={overBudget ? 'over' : ''}>
                  {totalSpent.toLocaleString('tr-TR')} {trip.currency}
                </span>
                <span className="budget-summary-of"> / {trip.budget.toLocaleString('tr-TR')} {trip.currency}</span>
              </div>
              <div className="budget-bar">
                <div className="budget-bar-fill" style={{ width: `${pct}%`, background: overBudget ? '#EF4444' : '#10B981' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'Güzergah' && <Itinerary trip={trip} store={store} />}
        {tab === 'Harita' && <MapView trip={trip} />}
        {tab === 'Bütçe' && <BudgetPanel trip={trip} store={store} />}
      </div>
    </div>
  );
}

function formatRange(s, e) {
  const opts = { day: 'numeric', month: 'long', year: 'numeric' };
  return `${new Date(s).toLocaleDateString('tr-TR', opts)} – ${new Date(e).toLocaleDateString('tr-TR', opts)}`;
}
