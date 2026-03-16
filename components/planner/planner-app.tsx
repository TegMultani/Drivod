'use client';

import { Download, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useTripPlanner } from '@/lib/hooks/use-trip-planner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlannerSidebar } from '@/components/planner/planner-sidebar';
import { ItineraryBoard } from '@/components/planner/itinerary-board';
import { MapPanel } from '@/components/planner/map-panel';

export function PlannerApp() {
  const planner = useTripPlanner();

  const onExport = () => {
    if (!planner.activeTrip) return;
    const blob = new Blob([planner.exportTrip(planner.activeTrip.id)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${planner.activeTrip.name}.json`;
    a.click();
    toast.success('Trip exported');
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      planner.importTrip(await file.text());
      toast.success('Trip imported');
    } catch {
      toast.error('Invalid JSON file');
    }
  };

  return (
    <div className="h-screen bg-background p-3">
      <div className="grid h-full grid-cols-[320px_1fr_40%] gap-3">
        <PlannerSidebar planner={planner} />
        <section className="rounded-xl border border-border bg-card shadow-panel">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card/95 p-3 backdrop-blur">
            <Input placeholder="Search itinerary" value={planner.search} onChange={(e) => planner.setSearch(e.target.value)} className="max-w-64" />
            <select className="h-9 rounded-lg border border-border bg-input px-3 text-sm" value={planner.tagFilter} onChange={(e) => planner.setTagFilter(e.target.value as any)}>
              <option value="all">All tags</option>
              {planner.TAGS.map((tag) => <option key={tag}>{tag}</option>)}
            </select>
            <label className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={planner.mapOnly} onChange={(e) => planner.setMapOnly(e.target.checked)} /> Include on map only
            </label>
            <div className="ml-auto flex items-center gap-2">
              <Button variant={planner.viewMode === 'day' ? 'default' : 'secondary'} size="sm" onClick={() => planner.setViewMode('day')}>Selected Day</Button>
              <Button variant={planner.viewMode === 'full' ? 'default' : 'secondary'} size="sm" onClick={() => planner.setViewMode('full')}>Full Trip</Button>
              <Button variant="secondary" size="icon" onClick={onExport}><Download className="h-4 w-4" /></Button>
              <label className="inline-flex cursor-pointer"><input type="file" accept="application/json" className="hidden" onChange={onImport} /><span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Upload className="h-4 w-4" /></span></label>
            </div>
          </header>
          {planner.activeTrip ? <ItineraryBoard planner={planner} /> : <div className='grid h-full place-items-center text-muted-foreground'>Create a trip to begin</div>}
        </section>
        <MapPanel planner={planner} />
      </div>
    </div>
  );
}
