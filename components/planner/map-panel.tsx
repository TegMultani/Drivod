'use client';

import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

const MapCanvas = dynamic(() => import('./map-canvas').then((m) => m.MapCanvas), { ssr: false });

export function MapPanel({ planner }: { planner: any }) {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-center justify-between border-b border-border p-3">
        <h3 className="text-sm font-semibold">Route Map</h3>
        <span className="text-xs text-muted-foreground">{planner.routeStops.length} included stops</span>
      </header>
      <div className="h-[calc(100%-53px)]">
        <MapCanvas planner={planner} />
      </div>
    </Card>
  );
}
