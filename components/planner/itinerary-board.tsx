'use client';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ItineraryBoard({ planner }: { planner: any }) {
  if (!planner.activeTrip) return null;
  const day = planner.selectedDay;
  const days = planner.viewMode === 'day' ? [day] : planner.activeTrip.days;

  return (
    <div className="h-[calc(100%-56px)] overflow-auto p-3">
      <div className="space-y-4">
        {days.map((d: any) => <DayBoard key={d.id} day={d} planner={planner} compact={planner.viewMode === 'full'} />)}
      </div>
    </div>
  );
}

function DayBoard({ day, planner, compact }: any) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const items = planner.filteredItems(day);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = day.items.find((i: any) => i.id === active.id);
    if (!activeItem) return;
    const overId = String(over.id);
    const targetBlock = overId.startsWith('drop-') ? overId.replace('drop-', '') : day.items.find((i: any) => i.id === overId)?.timeBlock;
    if (!targetBlock) return;
    const targetItems = day.items.filter((i: any) => i.timeBlock === targetBlock && i.id !== active.id);
    const overIndex = targetItems.findIndex((i: any) => i.id === overId);
    const insertIndex = overIndex >= 0 ? overIndex : targetItems.length;
    const moved = { ...activeItem, timeBlock: targetBlock };
    targetItems.splice(insertIndex, 0, moved);
    const untouched = day.items.filter((i: any) => i.timeBlock !== targetBlock && i.id !== active.id);
    planner.reorderDayItems(day.id, [...untouched, ...targetItems]);
  };

  return (
    <Card className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{day.label} <span className="text-muted-foreground">· {day.date}</span></h3>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {planner.TIME_BLOCKS.map((block: string) => {
            const blockItems = items.filter((i: any) => i.timeBlock === block).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
            return (
              <Card key={block} id={`drop-${block}`} className="min-h-52 p-2">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs uppercase text-muted-foreground">{block}</p>
                  <Button size="icon" variant="ghost" onClick={() => planner.upsertItem(day.id, { id: uuid(), title: 'New stop', displayName: 'New stop', notes: '', tag: 'Activity', includeOnMap: false, timeBlock: block, sortOrder: blockItems.length })}><Plus className="h-3 w-3" /></Button>
                </div>
                <SortableContext items={blockItems.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {blockItems.length === 0 ? <p className="rounded-lg border border-dashed border-border p-2 text-xs text-muted-foreground">Drop plans here</p> : blockItems.map((item: any) => (
                      <ItemCard key={item.id} item={item} dayId={day.id} planner={planner} />
                    ))}
                  </div>
                </SortableContext>
              </Card>
            );
          })}
        </div>
      </DndContext>
    </Card>
  );
}

function ItemCard({ item, dayId, planner }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return (
    <motion.div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners} layout className="rounded-lg border border-border bg-muted/60 p-2">
      <Input value={item.title} onChange={(e) => planner.upsertItem(dayId, { ...item, title: e.target.value, displayName: e.target.value })} className="mb-1 h-8" />
      <div className="mb-1 flex items-center gap-1">
        <select className="h-7 rounded-md bg-input px-2 text-xs" value={item.tag} onChange={(e) => planner.upsertItem(dayId, { ...item, tag: e.target.value })}>
          {planner.TAGS.map((tag: string) => <option key={tag}>{tag}</option>)}
        </select>
        <label className="text-[11px] text-muted-foreground"><input type="checkbox" className="mr-1" checked={item.includeOnMap} onChange={(e) => planner.upsertItem(dayId, { ...item, includeOnMap: e.target.checked })} />Map</label>
        <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => planner.removeItem(dayId, item.id)}><Trash2 className="h-3 w-3" /></Button>
      </div>
      <Textarea value={item.notes} onChange={(e) => planner.upsertItem(dayId, { ...item, notes: e.target.value })} className="min-h-14 text-xs" placeholder="Notes, booking refs, reminders..." />
    </motion.div>
  );
}
