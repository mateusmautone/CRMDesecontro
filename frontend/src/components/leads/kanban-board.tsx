"use client";

import { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CLIENTS } from "@/lib/data";
import type { Client, ClientStatus } from "@/lib/types";
import { listLeads, type LeadDTO } from "@/lib/api/leads";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { Plus, GripHorizontal, Trash2 } from "lucide-react";

type KanbanColumnConfig = {
  id: string;
  title: string;
  color?: string;
};

function mapLeadStatusToClientStatus(status: string): ClientStatus {
  switch (status) {
    case "contacted":
      return "Em conversa";
    case "qualified":
      return "Em negociação";
    case "lost":
      return "Cancelado";
    case "new":
    default:
      return "Convidado";
  }
}

export function KanbanBoard() {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [columns, setColumns] = useState<KanbanColumnConfig[]>([]);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

  // Carrega leads do backend na montagem e mapeia para o modelo de Client do app
  useEffect(() => {
    async function loadLeads() {
      try {
        const leads = await listLeads();
        if (!leads || leads.length === 0) return;

        const mapped: Client[] = leads.map((lead: LeadDTO) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email ?? "",
          company: lead.source ?? "",
          instagram: undefined,
          phone: lead.phone ?? undefined,
          city: undefined,
          portfolioUrl: undefined,
          notes: undefined,
          avatarUrl:
            "https://picsum.photos/seed/crm-lead-" + encodeURIComponent(lead.id) + "/100/100",
          status: mapLeadStatusToClientStatus(lead.status),
          type: "Brechó",
          tags: [],
          createdAt: new Date(lead.createdAt).toISOString().split("T")[0],
        }));

        setClients(mapped);
      } catch (err) {
        // Fallback silencioso: mantém CLIENTS mockados
        console.error("Erro ao carregar leads da API", err);
      }
    }

    loadLeads();
  }, []);

  useEffect(() => {
    // Inicializa colunas a partir do snapshot inicial dos clientes.
    // Depois disso, as colunas vivem independentes dos cards.
    const uniqueStatuses = Array.from(
      new Set(CLIENTS.map((c) => c.status))
    );
    setColumns(
      uniqueStatuses.map((status) => ({
        id: status,
        title: status,
      }))
    );
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (id: UniqueIdentifier): ClientStatus | null => {
    // Checa se é coluna pelo id
    if (columns.some((col) => col.id === id)) {
      return String(id) as ClientStatus;
    }
    // Senão, descobre pela coluna/status do cliente
    const client = clients.find((c) => c.id === id);
    return client?.status || null;
  };

  const handleAddColumn = () => {
    const id = `coluna-${Date.now()}`;
    const title = "Nova coluna";
    setColumns((prev) => [...prev, { id, title }]);
    setEditingColumnId(id);
  };

  const handleRenameColumn = (id: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title } : col))
    );
  };

  const handleRemoveColumn = (id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
    // Opcionalmente poderíamos mover clientes para outra coluna aqui
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = clients.find((c) => c.id === active.id);
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

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return;

    // Movimento de cards entre colunas
    if (activeColumn !== overColumn) {
      setClients((prev) => {
        const activeIndex = prev.findIndex((c) => c.id === activeId);

        if (activeIndex === -1) return prev;

        const newClients = [...prev];
        newClients[activeIndex] = {
          ...newClients[activeIndex],
          status: overColumn as ClientStatus,
        };
        return newClients;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveClient(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return;

    // Se for coluna sendo arrastada, reordena colunas
    const isColumnDrag = columns.some((col) => col.id === activeId);
    if (isColumnDrag) {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((col) => col.id === activeId);
        const newIndex = prev.findIndex((col) => col.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Se for card, mantém lógica de mudar de coluna
    if (activeColumn !== overColumn) {
      setClients((prev) => {
        const activeIndex = prev.findIndex((c) => c.id === activeId);
        if (activeIndex === -1) return prev;

        const newClients = [...prev];
        newClients[activeIndex] = {
          ...newClients[activeIndex],
          status: overColumn as ClientStatus,
        };
        return newClients;
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-w-0 w-full mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Wrapper card para estabilizar largura/estilo do kanban */}
        <div className="bg-card rounded-xl border-0 shadow-sm overflow-hidden flex-1 flex flex-col w-full min-w-0">
          <div className="flex items-center justify-between p-4 gap-4 border-b w-full">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GripHorizontal className="h-4 w-4" />
              <span>Arraste as colunas para reorganizar o funil</span>
            </div>
            <Button size="sm" className="h-8 px-3" onClick={handleAddColumn}>
              <Plus className="h-3 w-3 mr-1" />
              Nova coluna
            </Button>
          </div>
          <div className="kanban-scroll flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-2">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 h-full min-w-max">
                {columns.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    isEditing={editingColumnId === col.id}
                    onStartEdit={() => setEditingColumnId(col.id)}
                    onChangeTitle={(newTitle) =>
                      handleRenameColumn(col.id, newTitle)
                    }
                    onEndEdit={() => setEditingColumnId(null)}
                    onRemove={() => handleRemoveColumn(col.id)}
                    clients={clients.filter((c) => c.status === col.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
        <DragOverlay>
          {activeClient ? <KanbanCard client={activeClient} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
