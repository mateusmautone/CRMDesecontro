"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Send } from "lucide-react";

import type { Client, Interaction } from "@/lib/types";
import { listInteractions, createInteraction } from "@/lib/api/interactions";
import { mapInteractionDtoToInteraction } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getInteractionSuggestion } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InteractionManager({
  client,
  isOpen,
  onOpenChange,
}: {
  client: Client;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [items, setItems] = useState<Interaction[]>([]);
  const { toast } = useToast();

  const handleAddInteraction = async () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    try {
      const dto = await createInteraction({ type: 'note', content: newNote, clientId: client.id });
      const mapped = mapInteractionDtoToInteraction(dto);
      setItems((prev) => [mapped, ...prev]);
      setNewNote('');
      toast({ title: 'Interação Adicionada', description: `Suas anotações para ${client.name} foram salvas.` });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar interação.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGetSuggestion = async () => {
    setIsGettingSuggestion(true);
    const previousInteractionsSummary = items.map(i => i.notes).join("\n- ");
    const result = await getInteractionSuggestion({
      clientDescription: `Cliente: ${client.name} de ${client.company}. Status: ${client.status}. Tags: ${client.tags.join(', ')}`,
      previousInteractions: previousInteractionsSummary || "Nenhuma interação anterior.",
      currentGoal: "Continuar construindo o relacionamento e avançar para a próxima etapa.",
    });
    
    if (result.success && result.suggestion) {
      setNewNote(prev => `${prev ? prev + '\n\n' : ''}Sugestão da IA: ${result.suggestion}`);
      toast({
        title: "Sugestão da IA Pronta",
        description: "Uma sugestão foi adicionada às suas anotações.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro da IA",
        description: result.error || "Não foi possível gerar uma sugestão.",
      });
    }
    setIsGettingSuggestion(false);
  };

  // Carrega interações ao abrir o sheet ou trocar de cliente
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const dtos = await listInteractions({ clientId: client.id });
        if (cancelled) return;
        setItems(dtos.map(mapInteractionDtoToInteraction));
      } catch (err) {
        console.warn('Falha ao carregar interações');
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, client.id]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline">Interações com {client.name}</SheetTitle>
          <SheetDescription>
            Registre e gerencie todas as interações com este cliente.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="grid gap-4 p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Adicionar Nova Interação</h3>
            <Textarea
              placeholder="Digite suas anotações aqui..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
            />
            <div className="flex justify-between gap-2">
                <Button onClick={handleGetSuggestion} disabled={isGettingSuggestion} variant="outline">
                    {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Obter Sugestão da IA
                </Button>
                <Button onClick={handleAddInteraction} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Salvar Anotação
                </Button>
            </div>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Histórico de Interações</h3>
                {items.length > 0 ? (
                items.map((interaction) => (
                    <Card key={interaction.id}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm">Interação em {interaction.date}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            {interaction.notes}
                        </CardContent>
                    </Card>
                ))
                ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma interação registrada ainda.
                </p>
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
