"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { GripVertical } from 'lucide-react';
import type { Client } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  client: Client;
  isOverlay?: boolean;
}

export function KanbanCard({ client, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: client.id,
    data: {
      type: 'Client',
      client,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "bg-card text-card-foreground p-0 relative",
        isDragging && "opacity-50 z-50",
        isOverlay && "z-50 shadow-lg !opacity-100"
      )}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <Image
                src={client.avatarUrl}
                alt={client.name}
                width={32}
                height={32}
                className="rounded-full"
                data-ai-hint="person portrait"
                />
                <div>
                <div className="font-semibold text-sm">{client.name}</div>
                <div className="text-xs text-muted-foreground">
                    {client.company}
                </div>
                </div>
            </div>
            <div {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="w-4 h-4" />
            </div>
        </div>
        
        {client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {client.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
