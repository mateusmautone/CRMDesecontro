"use client";

import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { CLIENTS } from '@/lib/data';
import type { Client, ClientStatus } from '@/lib/types';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

const clientStatuses: ClientStatus[] = ['Lead', 'Contactado', 'Negociando', 'Ganho', 'Perdido'];

export function KanbanBoard() {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  const columns = useMemo(() => clientStatuses.map(status => ({
    id: status,
    title: status,
  })), []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = clients.find(c => c.id === active.id);
    if (client) {
      setActiveClient(client);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveAClient = active.data.current?.type === 'Client';
    const isOverAColumn = over.data.current?.type === 'Column';
  
    if (isActiveAClient && isOverAColumn) {
      setClients(prev => {
        const activeIndex = prev.findIndex(c => c.id === activeId);
        if (prev[activeIndex].status !== overId) {
          prev[activeIndex].status = overId as ClientStatus;
          return [...prev];
        }
        return prev;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveClient(null);
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id as string;
    const overId = over.id as string;
  
    if (activeId === overId) return;
  
    // This logic is simplified. A real app might need reordering logic.
    // For now, status change is handled in onDragOver
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto p-1">
        {columns.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            clients={clients.filter(c => c.status === col.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeClient ? <KanbanCard client={activeClient} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
