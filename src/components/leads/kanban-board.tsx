"use client";

import { useState, useMemo, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    const isOverAClient = over.data.current?.type === 'Client';

    if (isActiveAClient && isOverAClient) {
        setClients((prev) => {
            const activeIndex = prev.findIndex((c) => c.id === activeId);
            const overIndex = prev.findIndex((c) => c.id === overId);

            if (prev[activeIndex].status !== prev[overIndex].status) {
                const newClients = [...prev];
                newClients[activeIndex] = { ...newClients[activeIndex], status: prev[overIndex].status};
                return newClients;
            }
    
            return prev;
        });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveAClient && isOverAColumn) {
        setClients((prev) => {
            const activeIndex = prev.findIndex((c) => c.id === activeId);

            if (prev[activeIndex].status !== overId) {
                const newClients = [...prev];
                newClients[activeIndex] = { ...newClients[activeIndex], status: overId as ClientStatus};
                return newClients;
            }

            return prev;
        });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveClient(null);
      return;
    };
  
    if (active.id !== over.id) {
        const activeContainer = active.data.current?.sortable.containerId;
        const overContainer = over.data.current?.sortable?.containerId || over.id;

        if (activeContainer !== overContainer) {
            setClients((prev) => {
                const activeIndex = prev.findIndex((c) => c.id === active.id);
                if (activeIndex !== -1) {
                    const newClients = [...prev];
                    newClients[activeIndex] = {
                        ...newClients[activeIndex],
                        status: overContainer as ClientStatus,
                    };
                    return newClients;
                }
                return prev;
            });
        }
    }

    setActiveClient(null);
  };
  
  if (!isMounted) {
    return null;
  }

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
