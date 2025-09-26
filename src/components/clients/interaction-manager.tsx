"use client";

import { useState } from "react";
import { Loader2, Sparkles, Send } from "lucide-react";

import type { Client, Interaction } from "@/lib/types";
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
  interactions,
  isOpen,
  onOpenChange,
  onAddInteraction,
}: {
  client: Client;
  interactions: Interaction[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddInteraction: (interaction: Interaction) => void;
}) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const { toast } = useToast();

  const handleAddInteraction = () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    const newInteraction: Interaction = {
      id: `int_${Date.now()}`,
      clientId: client.id,
      date: new Date().toISOString().split("T")[0],
      notes: newNote,
    };
    // Simulate network delay
    setTimeout(() => {
      onAddInteraction(newInteraction);
      setNewNote("");
      setIsSubmitting(false);
      toast({
        title: "Interaction Added",
        description: `Your notes for ${client.name} have been saved.`,
      });
    }, 500);
  };
  
  const handleGetSuggestion = async () => {
    setIsGettingSuggestion(true);
    const previousInteractionsSummary = interactions.map(i => i.notes).join("\n- ");
    const result = await getInteractionSuggestion({
      clientDescription: `Client: ${client.name} from ${client.company}. Status: ${client.status}. Tags: ${client.tags.join(', ')}`,
      previousInteractions: previousInteractionsSummary || "No previous interactions.",
      currentGoal: "Continue building relationship and move to next stage.",
    });
    
    if (result.success && result.suggestion) {
      setNewNote(prev => `${prev ? prev + '\n\n' : ''}AI Suggestion: ${result.suggestion}`);
      toast({
        title: "AI Suggestion Ready",
        description: "A suggestion has been added to your notes.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: result.error || "Could not generate a suggestion.",
      });
    }
    setIsGettingSuggestion(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="font-headline">Interactions with {client.name}</SheetTitle>
          <SheetDescription>
            Record and manage all interactions with this client.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="grid gap-4 p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Add New Interaction</h3>
            <Textarea
              placeholder="Type your notes here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
            />
            <div className="flex justify-between gap-2">
                <Button onClick={handleGetSuggestion} disabled={isGettingSuggestion} variant="outline">
                    {isGettingSuggestion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get AI Suggestion
                </Button>
                <Button onClick={handleAddInteraction} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Save Note
                </Button>
            </div>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Interaction History</h3>
                {interactions.length > 0 ? (
                interactions.map((interaction) => (
                    <Card key={interaction.id}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm">Interaction on {interaction.date}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            {interaction.notes}
                        </CardContent>
                    </Card>
                ))
                ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No interactions recorded yet.
                </p>
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
