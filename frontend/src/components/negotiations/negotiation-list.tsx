"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Negotiation, NegotiationStatus } from "@/lib/types";
import { listNegotiations, createNegotiation, updateNegotiation, deleteNegotiation } from "@/lib/api/negotiations";
import { listClients } from "@/lib/api/clients";
import { mapNegotiationDtoToNegotiation } from "@/lib/mappers";

const negotiationStatuses = ["Ativa", "Pendente", "Fechada - Ganhos", "Fechada - Perdida"] as const;

const negotiationFormSchema = z.object({
  clientId: z.string().min(1, "É necessário selecionar um cliente."),
  status: z.enum(negotiationStatuses),
  agreementDetails: z
    .string()
    .min(10, "Os detalhes devem ter pelo menos 10 caracteres."),
});

type NegotiationFormData = z.infer<typeof negotiationFormSchema>;

const statusVariant: Record<
  NegotiationStatus,
  "default" | "secondary" | "destructive"
> = {
  Ativa: "default",
  Pendente: "secondary",
  "Fechada - Ganhos": "default",
  "Fechada - Perdida": "destructive",
};

const statusColors: Record<NegotiationStatus, string> = {
  Ativa: "bg-blue-100 text-blue-700 border-blue-200",
  Pendente: "bg-amber-100 text-amber-700 border-amber-200",
  "Fechada - Ganhos": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Fechada - Perdida": "bg-red-100 text-red-700 border-red-200",
};

export function NegotiationList() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string; company: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingNegotiation, setEditingNegotiation] =
    useState<Negotiation | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNegotiationId, setDeletingNegotiationId] = useState<
    string | null
  >(null);

  const { toast } = useToast();
  const form = useForm<NegotiationFormData>({
    resolver: zodResolver(negotiationFormSchema),
    defaultValues: {
      clientId: "",
      status: "Ativa",
      agreementDetails: "",
    },
  });

  const filteredNegotiations = useMemo(() => {
    return negotiations.filter(
      (neg) =>
        neg.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neg.agreementDetails.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [negotiations, searchTerm]);

  const handleOpenForm = (negotiation: Negotiation | null) => {
    setEditingNegotiation(negotiation);
    if (negotiation) {
      form.reset({
        clientId: negotiation.clientId,
        status: negotiation.status,
        agreementDetails: negotiation.agreementDetails,
      });
    } else {
      form.reset({ clientId: "", status: "Ativa", agreementDetails: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: NegotiationFormData) => {
    const client = clients.find((c) => c.id === data.clientId);
    if (!client) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Cliente não encontrado.' });
      return;
    }
    // Map UI status -> backend status
    const statusMapToBackend: Record<string, string> = {
      'Ativa': 'open',
      'Pendente': 'open',
      'Fechada - Ganhos': 'won',
      'Fechada - Perdida': 'lost',
    };
    try {
      if (editingNegotiation) {
        const dto = await updateNegotiation(editingNegotiation.id, {
          description: data.agreementDetails,
          status: statusMapToBackend[data.status],
          clientId: data.clientId,
        });
        setNegotiations((prev) => prev.map((n) => n.id === editingNegotiation.id ? mapNegotiationDtoToNegotiation(dto, client.name) : n));
        toast({ title: 'Negociação Atualizada', description: `A negociação com ${client.name} foi atualizada.` });
      } else {
        const dto = await createNegotiation({
          title: `Negociação com ${client.name}`,
          description: data.agreementDetails,
          status: statusMapToBackend[data.status],
          clientId: data.clientId,
        });
        const mapped = mapNegotiationDtoToNegotiation(dto, client.name);
        setNegotiations((prev) => [mapped, ...prev]);
        toast({ title: 'Negociação Criada', description: `A negociação com ${client.name} foi adicionada.` });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar negociação.' });
    } finally {
      setIsFormModalOpen(false);
    }
  };

  const handleOpenDeleteDialog = (negotiationId: string) => {
    setDeletingNegotiationId(negotiationId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteNegotiation = async () => {
    if (!deletingNegotiationId) return;
    try {
      await deleteNegotiation(deletingNegotiationId);
      setNegotiations((prev) => prev.filter((n) => n.id !== deletingNegotiationId));
      toast({ title: 'Negociação Excluída', variant: 'destructive' });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao excluir negociação.' });
    } finally {
      setDeletingNegotiationId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Carrega negociações e clientes ao montar
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [clientDtos, negotiationDtos] = await Promise.all([
          listClients(),
          listNegotiations(),
        ]);
        if (cancelled) return;
        const simpleClients = clientDtos.map(c => ({ id: c.id, name: c.name, company: c.company ?? c.name }));
        setClients(simpleClients);
        const clientNameMap = new Map(simpleClients.map(c => [c.id, c.name] as const));
        setNegotiations(negotiationDtos.map(dto => mapNegotiationDtoToNegotiation(dto, clientNameMap.get(dto.clientId || '') )));
      } catch (err) {
        console.warn('Falha ao carregar negociações, lista vazia.');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-xl p-4 border-0 shadow-sm">
          <Input
            placeholder="Buscar negociações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs h-9 bg-background"
          />
          <Button
            onClick={() => handleOpenForm(null)}
            size="sm"
            className="h-9 shadow-sm"
          >
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            Nova Negociação
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border-0 shadow-sm overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold w-[28%]">
                  Parceiro
                </TableHead>
                <TableHead className="font-semibold w-[140px]">
                  Status
                </TableHead>
                <TableHead className="font-semibold w-[52%]">
                  Detalhes
                </TableHead>
                <TableHead className="font-semibold w-[120px]">
                  Atualizado
                </TableHead>
                <TableHead className="w-[56px]">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNegotiations.map((neg) => (
                <TableRow key={neg.id} className="hover:bg-muted/50">
                  <TableCell className="w-[28%]">
                    <div className="font-medium text-sm">{neg.clientName}</div>
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 ${statusColors[neg.status]}`}
                    >
                      {neg.status.replace("Fechada - ", "")}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[52%]">
                    <p className="truncate text-sm text-muted-foreground">
                      {neg.agreementDetails}
                    </p>
                  </TableCell>
                  <TableCell className="w-[120px] text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(neg.lastUpdated).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="w-[56px] text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(neg)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleOpenDeleteDialog(neg.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingNegotiation
                ? "Editar Negociação"
                : "Adicionar Nova Negociação"}
            </DialogTitle>
            <DialogDescription>
              {editingNegotiation
                ? "Atualize os detalhes desta negociação."
                : "Preencha os detalhes para a nova negociação."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                name="clientId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} - {c.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {negotiationStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="agreementDetails"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes do Acordo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os termos, valores, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a
              negociação.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteNegotiation}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
