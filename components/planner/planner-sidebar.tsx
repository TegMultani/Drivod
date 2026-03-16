'use client';

import { Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function PlannerSidebar({ planner }: { planner: any }) {
  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-panel">
      <NewTripForm onCreate={planner.createNewTrip} />
      <Card className="p-2">
        <p className="px-2 pb-2 text-xs uppercase text-muted-foreground">Trips</p>
        <div className="space-y-1">
          {planner.trips.map((trip: any) => (
            <button key={trip.id} onClick={() => { planner.setActiveTripId(trip.id); planner.setSelectedDayId(trip.days[0]?.id); }} className={`w-full rounded-lg p-2 text-left ${planner.activeTripId === trip.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
              <p className="truncate text-sm font-medium">{trip.name}</p>
              <p className="text-xs text-muted-foreground">{trip.startDate} → {trip.endDate}</p>
            </button>
          ))}
        </div>
      </Card>
      {planner.activeTrip && (
        <Card className="flex-1 p-2">
          <div className="mb-2 flex gap-1">
            <Button variant="secondary" size="sm" onClick={() => { planner.duplicateTrip(planner.activeTrip.id); toast.success('Trip duplicated'); }}><Copy className="mr-1 h-3 w-3" />Duplicate</Button>
            <Button variant="destructive" size="sm" onClick={() => { planner.deleteTrip(planner.activeTrip.id); toast.success('Trip deleted'); }}><Trash2 className="mr-1 h-3 w-3" />Delete</Button>
          </div>
          <p className="px-2 text-xs uppercase text-muted-foreground">Days</p>
          <div className="mt-2 space-y-1">
            {planner.activeTrip.days.map((day: any, i: number) => (
              <button key={day.id} onClick={() => planner.setSelectedDayId(day.id)} className={`w-full rounded-lg p-2 text-left ${planner.selectedDay?.id === day.id ? 'bg-muted' : 'hover:bg-muted/40'}`}>
                <div className="text-sm">{day.label}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(day.date), 'EEE, MMM d')}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}

function NewTripForm({ onCreate }: { onCreate: (name: string, start: string, end: string) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const endDefault = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  return (
    <Card className="space-y-2 p-3">
      <p className="text-sm font-semibold">Create trip</p>
      <Input placeholder="Trip name" id="trip-name" defaultValue="Pacific Coast Escape" />
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" id="trip-start" defaultValue={today} />
        <Input type="date" id="trip-end" defaultValue={endDefault} />
      </div>
      <Button className="w-full" onClick={() => {
        const name = (document.getElementById('trip-name') as HTMLInputElement).value;
        const start = (document.getElementById('trip-start') as HTMLInputElement).value;
        const end = (document.getElementById('trip-end') as HTMLInputElement).value;
        onCreate(name, start, end); toast.success('Trip created');
      }}><Plus className="mr-1 h-4 w-4" />New trip</Button>
    </Card>
  );
}
