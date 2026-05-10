import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function numberIcon(n) {
  return L.divIcon({
    className: '',
    html: `<div style="background:#3B82F6;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function MapView({ trip }) {
  const allActivities = trip.days.flatMap(d =>
    d.activities.filter(a => a.lat && a.lng).map(a => ({ ...a, date: d.date }))
  );

  const center = allActivities.length > 0
    ? [allActivities[0].lat, allActivities[0].lng]
    : [39.9208, 32.8541];

  const polylinePoints = allActivities.map(a => [a.lat, a.lng]);

  return (
    <div className="map-wrapper">
      {allActivities.length === 0 && (
        <div className="map-hint">
          Haritada görünmesi için aktivitelere enlem/boylam koordinatı ekleyin.
        </div>
      )}
      <MapContainer center={center} zoom={allActivities.length > 0 ? 12 : 6} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polylinePoints.length > 1 && (
          <Polyline positions={polylinePoints} color="#3B82F6" weight={2} dashArray="6 4" />
        )}
        {allActivities.map((act, i) => (
          <Marker key={act.id} position={[act.lat, act.lng]} icon={numberIcon(i + 1)}>
            <Popup>
              <strong>{act.title}</strong><br />
              {act.location && <span>📍 {act.location}<br /></span>}
              {act.cost > 0 && <span>💰 {act.cost.toLocaleString('tr-TR')} {trip.currency}</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
