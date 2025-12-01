"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";
import type {
  Client,
  ClientStatus,
  ClientType,
  Interaction,
} from "@/lib/types";
import {
  listClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/api/clients";
import { mapClientDtoToClient } from "@/lib/mappers";
// Mapeamentos UI -> backend
function mapStatusToBackend(ui: string) {
  const map: Record<string, string> = {
    Convidado: "invited",
    "Em conversa": "conversing",
    "Em negociação": "negotiating",
    Confirmado: "confirmed",
    Cancelado: "cancelled",
  };
  return map[ui] || "invited";
}
function mapTypeToBackend(ui: string) {
  const map: Record<string, string> = {
    Brechó: "thrift",
    DJ: "dj",
    Food: "food",
    Patrocínio: "sponsorship",
    Outro: "other",
  };
  return map[ui] || "other";
}
import { InteractionManager } from "./interaction-manager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const clientStatuses = [
  "Convidado",
  "Em conversa",
  "Em negociação",
  "Confirmado",
  "Cancelado",
] as const satisfies ClientStatus[];

const clientTypes = [
  "Brechó",
  "DJ",
  "Food",
  "Patrocínio",
  "Outro",
] as const satisfies ClientType[];

const clientFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Endereço de e-mail inválido."),
  company: z
    .string()
    .min(2, "O nome da empresa deve ter pelo menos 2 caracteres."),
  instagram: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  portfolioUrl: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(clientTypes),
  status: z.enum(clientStatuses),
  tags: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

const statusVariant: Record<
  ClientStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Convidado: "outline",
  "Em conversa": "secondary",
  "Em negociação": "default",
  Confirmado: "default",
  Cancelado: "destructive",
};

const statusColors: Record<ClientStatus, string> = {
  Convidado: "bg-slate-100 text-slate-700 border-slate-200",
  "Em conversa": "bg-amber-100 text-amber-700 border-amber-200",
  "Em negociação": "bg-blue-100 text-blue-700 border-blue-200",
  Confirmado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelado: "bg-red-100 text-red-700 border-red-200",
};

const typeColors: Record<ClientType, string> = {
  Brechó: "bg-violet-100 text-violet-700 border-violet-200",
  DJ: "bg-pink-100 text-pink-700 border-pink-200",
  Food: "bg-orange-100 text-orange-700 border-orange-200",
  Patrocínio: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Outro: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ClientList() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: async () => {
      const dtos = await listClients();
      return dtos.map(mapClientDtoToClient);
    },
    staleTime: 1000 * 60, // 1 min
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isInteractionSheetOpen, setIsInteractionSheetOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      instagram: "",
      phone: "",
      city: "",
      portfolioUrl: "",
      notes: "",
      type: "Brechó",
      status: "Convidado",
      tags: "",
    },
  });

  const filteredClients = useMemo(() => {
    return (clients as Client[]).filter((client: Client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // useEffect removido: React Query já faz o fetch e cache

  const handleOpenInteractions = (client: Client) => {
    setSelectedClient(client);
    setIsInteractionSheetOpen(true);
  };

  // Interações carregadas diretamente pelo InteractionManager agora; removido estado local

  const handleOpenForm = (client: Client | null) => {
    setEditingClient(client);
    if (client) {
      form.reset({
        name: client.name,
        email: client.email,
        company: client.company,
        instagram: client.instagram ?? "",
        phone: client.phone ?? "",
        city: client.city ?? "",
        portfolioUrl: client.portfolioUrl ?? "",
        notes: client.notes ?? "",
        type: client.type,
        status: client.status as ClientStatus,
        tags: client.tags.join(", "),
      });
    } else {
      form.reset({
        name: "",
        email: "",
        company: "",
        instagram: "",
        phone: "",
        city: "",
        portfolioUrl: "",
        notes: "",
        type: "Brechó",
        status: "Convidado",
        tags: "",
      });
    }
    setIsFormModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      updateClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      if (editingClient) {
        await updateMutation.mutateAsync({
          id: editingClient.id,
          input: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            status: mapStatusToBackend(data.status),
            type: mapTypeToBackend(data.type),
            tags: data.tags
              ? data.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [],
          },
        });
        toast({
          title: "Cliente Atualizado",
          description: `${data.name} foi atualizado.`,
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          status: mapStatusToBackend(data.status),
          type: mapTypeToBackend(data.type),
          tags: data.tags
            ? data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        });
        toast({
          title: "Cliente Criado",
          description: `${data.name} foi adicionado.`,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Falha ao salvar cliente.",
        variant: "destructive",
      });
    } finally {
      setIsFormModalOpen(false);
    }
  };

  const handleOpenDeleteDialog = (clientId: string) => {
    setDeletingClientId(clientId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!deletingClientId) return;
    try {
      await deleteMutation.mutateAsync(deletingClientId);
      toast({ title: "Cliente Excluído", variant: "destructive" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Falha ao excluir cliente.",
        variant: "destructive",
      });
    } finally {
      setDeletingClientId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-xl p-4 border-0 shadow-sm">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <Input
              placeholder="Buscar parceiros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs h-9 bg-background"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  {statusFilter === "all" ? "Filtrar" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Todos
                </DropdownMenuItem>
                {clientStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={() => handleOpenForm(null)}
            size="sm"
            className="h-9 shadow-sm"
          >
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            Novo Parceiro
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border-0 shadow-sm overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold w-[40%]">
                  Parceiro
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold w-[140px]">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold w-[140px]">
                  Status
                </TableHead>
                <TableHead className="hidden lg:table-cell font-semibold w-[200px]">
                  Tags
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold w-[120px]">
                  Criado em
                </TableHead>
                <TableHead className="w-[56px]">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client: Client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="w-[40%]">
                    <div className="flex items-center gap-3">
                      <Image
                        src={client.avatarUrl}
                        alt={client.name}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-background"
                        data-ai-hint="person portrait"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm">{client.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell w-[140px]">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 ${
                        typeColors[client.type as ClientType]
                      }`}
                    >
                      {client.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 ${
                        statusColors[client.status as ClientStatus]
                      }`}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 2).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {client.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5"
                        >
                          +{client.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell w-[120px] text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(client.createdAt).toLocaleDateString("pt-BR")}
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
                        <DropdownMenuItem
                          onClick={() => handleOpenInteractions(client)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Ver Interações
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenForm(client)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleOpenDeleteDialog(client.id)}
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

      {selectedClient && (
        <InteractionManager
          client={selectedClient}
          isOpen={isInteractionSheetOpen}
          onOpenChange={setIsInteractionSheetOpen}
        />
      )}

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingClient ? "Editar parceiro" : "Novo parceiro"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingClient
                  ? "Atualize as informações deste parceiro do Desencontro."
                  : "Cadastre um novo brechó, DJ, food ou patrocinador para o evento."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex-1 overflow-y-auto overflow-x-hidden"
            >
              <div className="px-6 py-5 space-y-5">
                {/* Seção: Identificação */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Identificação
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nome</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="João Silva"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="company"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Projeto / Marca
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="Brechó Aurora"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientTypes.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Seção: Contato */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Contato
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="email@ex.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">WhatsApp</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="(11) 99999-9999"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="instagram"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Instagram</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="@usuario"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="city"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Cidade</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="SP - Centro"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Seção: Detalhes + Status lado a lado */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Detalhes
                    </h4>
                    <FormField
                      name="portfolioUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Portfólio / Link
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="https://linktr.ee/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="tags"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Tags</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="streetwear, hiphop"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Situação
                    </h4>
                    <FormField
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Status atual
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientStatuses.map((s) => (
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
                      name="notes"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Observações</FormLabel>
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="Cachê, horário, estrutura..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t bg-muted/30 flex justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  {editingClient ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              cliente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
