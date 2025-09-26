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
    if (!over || active.id === over.id) return;
  
    const activeId = active.id;
    const overId = over.id;
    
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isOverAColumn) {
      setClients((prev) => {
        const activeIndex = prev.findIndex((c) => c.id === activeId);
        if (activeIndex === -1 || prev[activeIndex].status === overId) {
          return prev;
        }
        
        const updatedClient = { ...prev[activeIndex], status: overId as ClientStatus };
        const newClients = [...prev];
        newClients[activeIndex] = updatedClient;
        
        return newClients;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveClient(null);
  };

  return (
    <div className="flex flex-col h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-grow overflow-x-auto p-1">
          <div className="flex gap-4 h-full">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                clients={clients.filter(c => c.status === col.id)}
              />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeClient ? <KanbanCard client={activeClient} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
