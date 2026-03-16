'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { v4 as uuid } from 'uuid';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export function MapCanvas({ planner }: { planner: any }) {
  const [pendingDayId, setPendingDayId] = useState('');
  const [query, setQuery] = useState('');
  const points = planner.routeStops.map((s: any) => [s.coordinates.lat, s.coordinates.lng]) as [number, number][];

  return (
    <div className="relative h-full">
      <MapContainer center={[51.1, -116.5]} zoom={6} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {planner.routeStops.map((stop: any) => (
          <Marker key={stop.id} position={[stop.coordinates.lat, stop.coordinates.lng]}>
            <Popup>
              <strong>{stop.displayName}</strong><br />{stop.tag}
            </Popup>
          </Marker>
        ))}
        {points.length > 1 && <Polyline positions={points} pathOptions={{ color: '#7ea2ff', weight: 4, opacity: 0.8 }} />}
        <Fit points={points} />
        <ClickToAdd planner={planner} pendingDayId={pendingDayId || planner.selectedDay?.id} />
      </MapContainer>
      <div className="absolute left-3 top-3 z-[999] space-y-2 rounded-lg border border-border bg-card/90 p-2 text-xs backdrop-blur">
        <div>Drop pin into day:
          <select className="ml-2 rounded bg-input px-2 py-1" onChange={(e) => setPendingDayId(e.target.value)} value={pendingDayId || planner.selectedDay?.id}>
            {planner.activeTrip?.days.map((d: any) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search place" className="rounded bg-input px-2 py-1"/>
          <button className="rounded bg-accent px-2 py-1 text-white" onClick={async () => {
            if (!query) return;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            const first = data?.[0];
            if (!first) return toast.error('No place found');
            const day = planner.activeTrip?.days.find((d: any) => d.id === (pendingDayId || planner.selectedDay?.id));
            if (!day) return;
            planner.upsertItem(day.id, { id: uuid(), title: query, displayName: query, notes: '', tag: 'Activity', includeOnMap: true, timeBlock: 'afternoon', sortOrder: day.items.length, coordinates: { lat: Number(first.lat), lng: Number(first.lon) }, address: first.display_name, placeMeta: { provider: 'nominatim', placeId: first.place_id, sourceName: first.display_name } });
            toast.success('Place added from search');
          }}>Add</button>
        </div>
      </div>
      {points.length === 0 && <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">No included stops yet. Toggle “Map” on itinerary items or drop a pin.</div>}
    </div>
  );
}

function Fit({ points }: { points: [number, number][] }) {
  const map = useMap();
  useMemo(() => {
    if (points.length === 1) map.setView(points[0], 9);
    if (points.length > 1) map.fitBounds(points, { padding: [30, 30] });
  }, [points, map]);
  return null;
}

function ClickToAdd({ planner, pendingDayId }: any) {
  useMapEvents({
    click: (e) => {
      if (!pendingDayId) return;
      const day = planner.activeTrip?.days.find((d: any) => d.id === pendingDayId);
      if (!day) return;
      planner.upsertItem(day.id, {
        id: uuid(),
        title: 'Dropped pin stop',
        displayName: 'Dropped pin stop',
        notes: '',
        tag: 'Scenic Stop',
        includeOnMap: true,
        timeBlock: 'afternoon',
        sortOrder: day.items.length,
        coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
        placeMeta: { provider: 'manual' }
      });
    }
  });
  return null;
}
