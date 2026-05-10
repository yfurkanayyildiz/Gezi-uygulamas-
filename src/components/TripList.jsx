import { useState } from 'react';

const COLORS = {
  '#3B82F6': 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  '#10B981': 'linear-gradient(135deg, #10B981, #065F46)',
  '#F59E0B': 'linear-gradient(135deg, #F59E0B, #92400E)',
  '#EF4444': 'linear-gradient(135deg, #EF4444, #991B1B)',
  '#8B5CF6': 'linear-gradient(135deg, #8B5CF6, #4C1D95)',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function dayCount(start, end) {
  const diff = new Date(end) - new Date(start);
  return Math.round(diff / 86400000) + 1;
}

export default function TripList({ trips, selectedId, onSelect, onDelete }) {
  const [confirm, setConfirm] = useState(null);

  return (
    <div className="trip-list">
      <div className="trip-list-header">
        <h3>Gezilerim</h3>
        <span className="badge">{trips.length}</span>
      </div>
      {trips.length === 0 && (
        <p className="trip-list-empty">Henüz gezi yok.</p>
      )}
      {trips.map(trip => (
        <div
          key={trip.id}
          className={`trip-card ${selectedId === trip.id ? 'active' : ''}`}
          onClick={() => onSelect(trip.id)}
        >
          <div className="trip-card-accent" style={{ background: COLORS[trip.coverColor] || COLORS['#3B82F6'] }} />
          <div className="trip-card-body">
            <div className="trip-card-title">{trip.title}</div>
            <div className="trip-card-dest">📍 {trip.destination}</div>
            <div className="trip-card-meta">
              <span>🗓️ {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
              <span className="trip-card-days">{dayCount(trip.startDate, trip.endDate)} gün</span>
            </div>
          </div>
          {confirm === trip.id ? (
            <div className="trip-card-confirm" onClick={e => e.stopPropagation()}>
              <span>Sil?</span>
              <button className="btn-danger-sm" onClick={() => { onDelete(trip.id); setConfirm(null); }}>Evet</button>
              <button className="btn-ghost-sm" onClick={() => setConfirm(null)}>İptal</button>
            </div>
          ) : (
            <button className="trip-card-delete" title="Sil" onClick={e => { e.stopPropagation(); setConfirm(trip.id); }}>🗑️</button>
          )}
        </div>
      ))}
    </div>
  );
}
