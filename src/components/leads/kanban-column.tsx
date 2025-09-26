"use client";

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './kanban-card';
import type { Client } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  clients: Client[];
}

export function KanbanColumn({ id, title, clients }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
    }
  });

  return (
    <Card 
      ref={setNodeRef} 
      className={cn(
        "w-80 h-full flex flex-col shrink-0 bg-muted/50 transition-colors",
        isOver && "bg-muted"
      )}
    >
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-base font-semibold">{title} ({clients.length})</CardTitle>
      </CardHeader>
      <SortableContext
        id={id}
        items={clients.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea className="flex-1">
            <CardContent className="p-2 space-y-2 min-h-[100px]">
              {clients.map(client => (
                <KanbanCard key={client.id} client={client} />
              ))}
              {!clients.length && (
                <div className="text-center text-sm text-muted-foreground p-4">
                  Nenhum lead nesta etapa.
                </div>
              )}
            </CardContent>
          </ScrollArea>
      </SortableContext>
    </Card>
  );
}
