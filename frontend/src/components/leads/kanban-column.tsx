"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import type { Client } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onChangeTitle?: (title: string) => void;
  onEndEdit?: () => void;
  onRemove?: () => void;
  clients: Client[];
}

const columnPalettes = [
  {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
    pill: "bg-slate-200 text-slate-600",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    pill: "bg-amber-200 text-amber-700",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
    pill: "bg-blue-200 text-blue-700",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    pill: "bg-emerald-200 text-emerald-700",
  },
  {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-400",
    pill: "bg-red-200 text-red-700",
  },
];

function getColumnColors(id: string) {
  const hash = Array.from(id).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const palette = columnPalettes[hash % columnPalettes.length];
  return palette;
}

export function KanbanColumn({
  id,
  title,
  isEditing,
  onStartEdit,
  onChangeTitle,
  onEndEdit,
  onRemove,
  clients,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });
  const colors = getColumnColors(id);

  const {
    setNodeRef: setSortableRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: "Column",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={(node) => {
        setNodeRef(node);
        setSortableRef(node);
      }}
      style={style}
      className={cn(
        "w-80 h-full max-h-full flex flex-col shrink-0 border-0 shadow-sm transition-all duration-200",
        colors.bg,
        isOver && "ring-2 ring-primary/30 shadow-md"
      )}
    >
      <CardHeader
        className={cn(
          "p-3 border-b shrink-0 cursor-grab active:cursor-grabbing select-none",
          colors.border
        )}
        {...attributes}
        {...listeners}
      >
        <CardTitle className="text-sm font-semibold flex items-center gap-2 w-full">
          <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
          {isEditing ? (
            <input
              autoFocus
              defaultValue={title}
              onBlur={(e) => {
                const value = e.target.value.trim() || "Nova coluna";
                onChangeTitle?.(value);
                onEndEdit?.();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "flex-1 bg-transparent text-xs outline-none border-none px-1 py-0.5 rounded-sm focus-visible:ring-1 focus-visible:ring-primary/40",
                colors.text
              )}
            />
          ) : (
            <span
              className={cn("flex-1 truncate px-1", colors.text)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onStartEdit?.();
              }}
            >
              {title}
            </span>
          )}
          <span
            className={cn(
              "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
              colors.pill
            )}
          >
            {clients.length}
          </span>
          {onRemove && (
            <button
              type="button"
              className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-transparent text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ×
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <SortableContext
        id={id}
        items={clients.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea className="flex-1 min-h-0">
          <CardContent className="p-2 space-y-2">
            {clients.map((client) => (
              <KanbanCard key={client.id} client={client} />
            ))}
            {!clients.length && (
              <div
                className={cn(
                  "text-center text-sm p-6 rounded-xl border-2 border-dashed",
                  colors.border,
                  colors.text,
                  "opacity-50"
                )}
              >
                Nenhum parceiro
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </SortableContext>
    </Card>
  );
}
