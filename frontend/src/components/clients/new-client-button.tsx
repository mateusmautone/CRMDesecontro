"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/api/clients";
import { mapClientDtoToClient } from "@/lib/mappers";
import type { Client } from "@/lib/types";

interface NewClientButtonProps {
  onCreated?: (client: Client) => void;
  size?: "sm" | "default";
}

export function NewClientButton({ onCreated, size = "sm" }: NewClientButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, email e empresa.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const dto = await createClient({
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone || undefined,
      });
      const mapped = mapClientDtoToClient(dto);
      onCreated?.(mapped);
      toast({ title: "Cliente criado", description: `${form.name} adicionado.` });
      setOpen(false);
      setForm({ name: "", email: "", company: "", phone: "" });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao criar", description: "Verifique dados ou tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size={size} className="h-9" onClick={() => setOpen(true)}>
        Novo Parceiro
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo parceiro</DialogTitle>
            <DialogDescription>Cadastre um novo parceiro do evento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Nome</label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="João Silva" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Email</label>
              <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@ex.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Projeto / Marca</label>
              <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Brechó Aurora" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">WhatsApp (opcional)</label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
              <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
