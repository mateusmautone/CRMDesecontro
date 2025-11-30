"use client";

import { FormEvent, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import {
  Building2,
  Mail,
  CalendarDays,
  CheckCircle2,
  Circle,
  ListTodo,
  Plus,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import type { Client } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface KanbanCardProps {
  client: Client;
  isOverlay?: boolean;
}

export function KanbanCard({ client, isOverlay }: KanbanCardProps) {
  const [open, setOpen] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<
    { id: number; text: string; done: boolean }[]
  >([]);

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
      type: "Client",
      client,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = () => {
    if (isOverlay) return;
    setOpen(true);
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      { id: Date.now(), text: trimmed, done: false },
      ...prev,
    ]);
    setTaskInput("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-card text-card-foreground p-0 relative cursor-grab active:cursor-grabbing border-0 shadow-sm hover:shadow-md transition-all duration-200",
          isDragging && "opacity-50 z-50 rotate-2",
          isOverlay && "z-50 shadow-xl !opacity-100 rotate-2"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src={client.avatarUrl}
              alt={client.name}
              width={36}
              height={36}
              className="rounded-full ring-2 ring-background"
              data-ai-hint="person portrait"
            />
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">
                {client.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {client.company}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-medium bg-muted/50"
            >
              {client.type}
            </Badge>
            {client.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
            {client.tags.length > 2 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{client.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header com avatar e nome */}
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 pb-4">
            <DialogHeader className="flex-row items-start gap-4 space-y-0">
              <div className="relative">
                <Image
                  src={client.avatarUrl}
                  alt={client.name}
                  width={72}
                  height={72}
                  className="rounded-2xl border-4 border-background shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <DialogTitle className="text-xl font-bold leading-tight">
                  {client.name}
                </DialogTitle>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-background/80"
                  >
                    {client.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {client.status}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Informações do cliente */}
          <div className="px-6 py-4 space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>{client.company}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>
                  Adicionado em{" "}
                  {new Date(client.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {client.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {client.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs rounded-full px-2.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Lista de tarefas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <ListTodo className="h-3.5 w-3.5" />
                  Tarefas
                </div>
                {tasks.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {tasks.filter((t) => t.done).length}/{tasks.length}{" "}
                    concluídas
                  </span>
                )}
              </div>

              {/* Progresso visual */}
              {tasks.length > 0 && (
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                    style={{
                      width: `${
                        (tasks.filter((t) => t.done).length / tasks.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              )}

              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  className="flex-1 text-sm rounded-lg border bg-muted/50 px-3 py-2 outline-none placeholder:text-muted-foreground/60 focus:bg-background focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Adicionar tarefa..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={!taskInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {tasks.length > 0 ? (
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors",
                        task.done
                          ? "bg-muted/40 hover:bg-muted/60"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className="flex items-start gap-3 flex-1 min-w-0"
                      >
                        {task.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60 mt-0.5" />
                        )}
                        <span
                          className={cn(
                            "flex-1 text-left break-words",
                            task.done && "line-through text-muted-foreground"
                          )}
                        >
                          {task.text}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  Nenhuma tarefa ainda. Adicione uma acima!
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
