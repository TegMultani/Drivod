export const TIME_BLOCKS = ['morning', 'afternoon', 'evening', 'night'] as const;
export type TimeBlock = (typeof TIME_BLOCKS)[number];

export const TAGS = [
  'Food','Hike','Scenic Stop','Overnight','Activity','Coffee','Gas','Hotel','Campground','Parking','Reservation'
] as const;
export type TripTag = (typeof TAGS)[number];

export type PlaceMeta = {
  provider?: 'nominatim' | 'manual';
  placeId?: string;
  sourceName?: string;
};

export type ItineraryItem = {
  id: string;
  title: string;
  displayName: string;
  notes: string;
  tag: TripTag;
  includeOnMap: boolean;
  timeBlock: TimeBlock;
  sortOrder: number;
  coordinates?: { lat: number; lng: number };
  address?: string;
  placeMeta?: PlaceMeta;
};

export type DayPlan = {
  id: string;
  date: string;
  label: string;
  items: ItineraryItem[];
};

export type Trip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
};

export type ViewMode = 'day' | 'full';
