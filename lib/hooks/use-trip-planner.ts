'use client';

import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { rockiesSeedTrip, createTrip } from '@/lib/data/trip-factory';
import { loadTrips, saveTrips } from '@/lib/data/storage';
import { DayPlan, ItineraryItem, TAGS, TimeBlock, Trip, TripTag, ViewMode } from '@/lib/types/trip';

export function useTripPlanner() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string>('');
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<TripTag | 'all'>('all');
  const [mapOnly, setMapOnly] = useState(false);

  useEffect(() => {
    const stored = loadTrips();
    const initial = stored.length ? stored : [rockiesSeedTrip()];
    setTrips(initial);
    setActiveTripId(initial[0]?.id ?? '');
    setSelectedDayId(initial[0]?.days[0]?.id ?? '');
  }, []);

  useEffect(() => {
    if (trips.length) saveTrips(trips);
  }, [trips]);

  const activeTrip = useMemo(() => trips.find((t) => t.id === activeTripId), [trips, activeTripId]);
  const selectedDay = useMemo(() => activeTrip?.days.find((d) => d.id === selectedDayId) ?? activeTrip?.days[0], [activeTrip, selectedDayId]);

  const updateTrip = (tripId: string, updater: (trip: Trip) => Trip) => {
    setTrips((prev) => prev.map((trip) => (trip.id === tripId ? updater({ ...trip }) : trip)));
  };

  const createNewTrip = (name: string, startDate: string, endDate: string) => {
    const trip = createTrip(name, startDate, endDate);
    setTrips((prev) => [trip, ...prev]);
    setActiveTripId(trip.id);
    setSelectedDayId(trip.days[0]?.id ?? '');
  };

  const duplicateTrip = (tripId: string) => {
    const original = trips.find((t) => t.id === tripId);
    if (!original) return;
    const duplicated: Trip = {
      ...original,
      id: uuid(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: original.days.map((day) => ({ ...day, id: uuid(), items: day.items.map((i) => ({ ...i, id: uuid() })) }))
    };
    setTrips((prev) => [duplicated, ...prev]);
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId) {
      const fallback = trips.find((t) => t.id !== tripId);
      setActiveTripId(fallback?.id ?? '');
      setSelectedDayId(fallback?.days[0]?.id ?? '');
    }
  };

  const upsertItem = (dayId: string, item: ItineraryItem) => {
    if (!activeTrip) return;
    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      updatedAt: new Date().toISOString(),
      days: trip.days.map((day) =>
        day.id === dayId
          ? { ...day, items: day.items.some((i) => i.id === item.id) ? day.items.map((i) => (i.id === item.id ? item : i)) : [...day.items, item] }
          : day
      )
    }));
  };

  const removeItem = (dayId: string, itemId: string) => {
    if (!activeTrip) return;
    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      updatedAt: new Date().toISOString(),
      days: trip.days.map((day) => (day.id === dayId ? { ...day, items: day.items.filter((i) => i.id !== itemId) } : day))
    }));
  };

  const reorderDayItems = (dayId: string, ordered: ItineraryItem[]) => {
    if (!activeTrip) return;
    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      updatedAt: new Date().toISOString(),
      days: trip.days.map((d) => (d.id === dayId ? { ...d, items: ordered.map((i, idx) => ({ ...i, sortOrder: idx })) } : d))
    }));
  };

  const filteredItems = (day: DayPlan) => day.items
    .filter((item) => tagFilter === 'all' || item.tag === tagFilter)
    .filter((item) => !mapOnly || item.includeOnMap)
    .filter((item) => !search || `${item.title} ${item.displayName} ${item.notes}`.toLowerCase().includes(search.toLowerCase()));

  const dayStops = (day: DayPlan) => filteredItems(day)
    .filter((i) => i.includeOnMap && i.coordinates)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const routeStops = useMemo(() => {
    if (!activeTrip) return [];
    if (viewMode === 'day' && selectedDay) return dayStops(selectedDay);
    return activeTrip.days.flatMap((d) => dayStops(d));
  }, [activeTrip, selectedDay, viewMode, search, tagFilter, mapOnly]);

  const exportTrip = (tripId: string) => JSON.stringify(trips.find((t) => t.id === tripId), null, 2);

  const importTrip = (payload: string) => {
    const imported = JSON.parse(payload) as Trip;
    if (!imported?.days?.length) throw new Error('Invalid trip format');
    setTrips((prev) => [{ ...imported, id: uuid() }, ...prev]);
  };

  return {
    TAGS,
    TIME_BLOCKS: ['morning', 'afternoon', 'evening', 'night'] as TimeBlock[],
    trips,
    activeTrip,
    selectedDay,
    activeTripId,
    selectedDayId,
    viewMode,
    setViewMode,
    setSearch,
    search,
    tagFilter,
    setTagFilter,
    mapOnly,
    setMapOnly,
    filteredItems,
    routeStops,
    setActiveTripId,
    setSelectedDayId,
    createNewTrip,
    duplicateTrip,
    deleteTrip,
    upsertItem,
    removeItem,
    reorderDayItems,
    exportTrip,
    importTrip
  };
}
