import { useState, useEffect } from 'react';
import { fetchImage } from '../ai/fetchImage';
import Lightbox from './Lightbox';

const CATEGORIES = {
  kultur: { label: 'Kültür', icon: '🏛️' },
  yemek: { label: 'Yemek', icon: '🍽️' },
  eglenme: { label: 'Eğlence', icon: '🎉' },
  alisveris: { label: 'Alışveriş', icon: '🛍️' },
  ulasim: { label: 'Ulaşım', icon: '🚗' },
  doga: { label: 'Doğa', icon: '🌿' },
  diger: { label: 'Diğer', icon: '📌' },
};

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}


function DayImage({ query }) {
  const [url, setUrl] = useState(null);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchImage(query).then(u => { if (!cancelled) setUrl(u); });
    return () => { cancelled = true; };
  }, [query]);

  if (!url) return null;
  return (
    <>
      <img src={url} alt={query} className="day-cover-img clickable-img" onClick={() => setLightbox(true)} />
      {lightbox && <Lightbox src={url} alt={query} onClose={() => setLightbox(false)} />}
    </>
  );
}

function ActivityThumb({ activity }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const query = activity.imageQuery || activity.location || activity.title;

  useEffect(() => {
    let cancelled = false;
    fetchImage(query).then(u => {
      if (!cancelled) { setUrl(u); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [query]);

  if (loading) return <div className="activity-thumb activity-thumb-fallback activity-thumb-loading" />;

  if (!url) {
    return (
      <div className="activity-thumb activity-thumb-fallback">
        {CATEGORIES[activity.category]?.icon || '📌'}
      </div>
    );
  }

  return (
    <>
      <img
        src={url}
        alt={activity.title}
        className="activity-thumb clickable-img"
        onClick={() => setLightbox(true)}
      />
      {lightbox && <Lightbox src={url} alt={activity.title} onClose={() => setLightbox(false)} />}
    </>
  );
}

export default function Itinerary({ trip, store }) {
  const [showAddDay, setShowAddDay] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [addingActivity, setAddingActivity] = useState(null);

  function handleAddDay() {
    if (!newDate) return;
    store.addDay(trip.id, newDate);
    setNewDate('');
    setShowAddDay(false);
  }

  return (
    <div className="itinerary">
      {trip.days.length === 0 && (
        <div className="itinerary-empty">
          <p>Henüz gün eklenmedi. Güzergahınızı oluşturmak için gün ekleyin.</p>
        </div>
      )}

      {trip.days.map((day, idx) => (
        <div key={day.id} className="day-block">
          <div className="day-cover">
            <DayImage query={day.activities.find(a => a.imageQuery || a.location)?.imageQuery || day.activities.find(a => a.location)?.location || trip.destination} />
            <div className="day-cover-label">
              <span className="day-number">Gün {idx + 1}</span>
              <span className="day-date-text">{formatDate(day.date)}</span>
            </div>
          </div>
          <div className="activity-list">
            {day.activities.map(act => (
              <div key={act.id} className="activity-item">
                <div className="activity-left">
                  <ActivityThumb activity={act} />
                  <div className="activity-time">{act.time}</div>
                </div>
                <div className="activity-body">
                  <div className="activity-title">{act.title}</div>
                  {act.location && <div className="activity-loc">📍 {act.location}</div>}
                  {act.notes && <div className="activity-notes">{act.notes}</div>}
                </div>
                {act.cost > 0 && <div className="activity-cost">{act.cost.toLocaleString('tr-TR')} {trip.currency}</div>}
                <button className="activity-delete" onClick={() => store.deleteActivity(trip.id, day.id, act.id)} title="Sil">✕</button>
              </div>
            ))}
          </div>
          {addingActivity === day.id ? (
            <ActivityForm
              tripCurrency={trip.currency}
              onSave={(act) => { store.addActivity(trip.id, day.id, act); setAddingActivity(null); }}
              onCancel={() => setAddingActivity(null)}
            />
          ) : (
            <button className="btn-add-activity" onClick={() => setAddingActivity(day.id)}>+ Aktivite Ekle</button>
          )}
        </div>
      ))}

      {showAddDay ? (
        <div className="add-day-form">
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
            min={trip.startDate} max={trip.endDate} />
          <button className="btn-primary" onClick={handleAddDay}>Ekle</button>
          <button className="btn-ghost" onClick={() => setShowAddDay(false)}>İptal</button>
        </div>
      ) : (
        <button className="btn-add-day" onClick={() => setShowAddDay(true)}>+ Gün Ekle</button>
      )}
    </div>
  );
}

function ActivityForm({ onSave, onCancel, tripCurrency }) {
  const [form, setForm] = useState({
    time: '09:00',
    title: '',
    location: '',
    lat: '',
    lng: '',
    cost: '',
    category: 'diger',
    notes: '',
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    if (!form.title) return;
    onSave({ ...form, lat: parseFloat(form.lat) || null, lng: parseFloat(form.lng) || null, cost: Number(form.cost) || 0 });
  }

  return (
    <form className="activity-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Saat
          <input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
        </label>
        <label style={{ flex: 3 }}>
          Aktivite Adı *
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="ör. Müze Ziyareti" required />
        </label>
        <label>
          Kategori
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label style={{ flex: 2 }}>
          Konum
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="ör. Topkapı Sarayı" />
        </label>
        <label>
          Enlem
          <input type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="41.0086" />
        </label>
        <label>
          Boylam
          <input type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="28.9802" />
        </label>
        <label>
          Maliyet ({tripCurrency})
          <input type="number" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0" min="0" />
        </label>
      </div>
      <label>
        Notlar
        <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="İsteğe bağlı not..." />
      </label>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>İptal</button>
        <button type="submit" className="btn-primary">Kaydet</button>
      </div>
    </form>
  );
}
