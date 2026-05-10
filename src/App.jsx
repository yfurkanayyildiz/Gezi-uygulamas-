import { useState } from 'react';
import { useTripStore } from './store/useTripStore';
import Navbar from './components/Navbar';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import NewTripModal from './components/NewTripModal';
import './App.css';

export default function App() {
  const store = useTripStore();
  const [selectedTripId, setSelectedTripId] = useState(store.trips[0]?.id || null);
  const [showNewTrip, setShowNewTrip] = useState(false);

  const selectedTrip = store.trips.find(t => t.id === selectedTripId);

  return (
    <div className="app">
      <Navbar onNewTrip={() => setShowNewTrip(true)} />
      <div className="main-layout">
        <aside className="sidebar">
          <TripList
            trips={store.trips}
            selectedId={selectedTripId}
            onSelect={setSelectedTripId}
            onDelete={(id) => {
              store.deleteTrip(id);
              if (selectedTripId === id) setSelectedTripId(store.trips.find(t => t.id !== id)?.id || null);
            }}
          />
        </aside>
        <main className="content">
          {selectedTrip ? (
            <TripDetail trip={selectedTrip} store={store} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✈️</div>
              <h2>Seyahatinizi Planlayın</h2>
              <p>Sol panelden bir gezi seçin veya yeni bir tane oluşturun.</p>
              <button className="btn-primary" onClick={() => setShowNewTrip(true)}>
                + Yeni Gezi Oluştur
              </button>
            </div>
          )}
        </main>
      </div>
      {showNewTrip && (
        <NewTripModal
          onClose={() => setShowNewTrip(false)}
          onCreate={(trip) => {
            const id = store.addTrip(trip);
            setSelectedTripId(id);
            setShowNewTrip(false);
          }}
        />
      )}
    </div>
  );
}
