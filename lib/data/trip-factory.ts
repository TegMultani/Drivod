import { eachDayOfInterval, format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { DayPlan, ItineraryItem, TimeBlock, Trip, TripTag } from '@/lib/types/trip';

const nowIso = () => new Date().toISOString();

export function buildDays(startDate: string, endDate: string): DayPlan[] {
  return eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map((d, i) => ({
    id: uuid(),
    date: format(d, 'yyyy-MM-dd'),
    label: `Day ${i + 1}`,
    items: []
  }));
}

export function createTrip(name: string, startDate: string, endDate: string): Trip {
  const ts = nowIso();
  return { id: uuid(), name, startDate, endDate, days: buildDays(startDate, endDate), createdAt: ts, updatedAt: ts };
}

function item(partial: Partial<ItineraryItem> & { title: string; timeBlock: TimeBlock; sortOrder: number; tag: TripTag }): ItineraryItem {
  return {
    id: uuid(),
    displayName: partial.title,
    notes: '',
    includeOnMap: false,
    ...partial
  } as ItineraryItem;
}

export function rockiesSeedTrip(): Trip {
  const trip = createTrip('Canadian Rockies Escape', '2026-06-12', '2026-06-13');
  trip.days[0].label = 'Day 1 · Revelstoke';
  trip.days[0].items = [
    item({ title: 'Breakfast at Dose Coffee', tag: 'Coffee', timeBlock: 'morning', sortOrder: 0, includeOnMap: false }),
    item({ title: 'Drive to Revelstoke Dam', tag: 'Scenic Stop', timeBlock: 'morning', sortOrder: 1, includeOnMap: true, coordinates: { lat: 51.0366, lng: -118.1979 } }),
    item({ title: 'Meadows in the Sky Parkway', tag: 'Hike', timeBlock: 'afternoon', sortOrder: 0, includeOnMap: true, coordinates: { lat: 51.0744, lng: -117.9718 } }),
    item({ title: 'Dinner at Quartermaster Eatery', tag: 'Food', timeBlock: 'evening', sortOrder: 0, includeOnMap: false }),
    item({ title: 'Basecamp Resort Revelstoke', tag: 'Hotel', timeBlock: 'night', sortOrder: 0, includeOnMap: true, coordinates: { lat: 50.9978, lng: -118.1952 } })
  ];
  trip.days[1].label = 'Day 2 · Banff';
  trip.days[1].items = [
    item({ title: 'Drive to Lake Louise', tag: 'Scenic Stop', timeBlock: 'morning', sortOrder: 0, includeOnMap: true, coordinates: { lat: 51.4254, lng: -116.1773 } }),
    item({ title: 'Lake Agnes Tea House Hike', tag: 'Hike', timeBlock: 'afternoon', sortOrder: 0, includeOnMap: true, coordinates: { lat: 51.416, lng: -116.2168 } }),
    item({ title: 'Banff Ave Dinner', tag: 'Food', timeBlock: 'evening', sortOrder: 0, includeOnMap: false }),
    item({ title: 'Canalta Lodge Check-in', tag: 'Overnight', timeBlock: 'night', sortOrder: 0, includeOnMap: true, coordinates: { lat: 51.1805, lng: -115.5707 } })
  ];
  return trip;
}
