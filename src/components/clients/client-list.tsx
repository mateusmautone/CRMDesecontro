"use client";

import { useState, useMemo, type ReactNode } from "react";
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
import type { Client, ClientStatus, Interaction } from "@/lib/types";
import { CLIENTS, INTERACTIONS } from "@/lib/data";
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

const clientStatuses: ClientStatus[] = ['Lead', 'Contacted', 'Negotiating', 'Won', 'Lost'];

const clientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  status: z.enum(clientStatuses),
  tags: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

const statusVariant: Record<ClientStatus, "default" | "secondary" | "destructive" | "outline"> = {
  'Lead': "secondary",
  'Contacted': "outline",
  'Negotiating': "default",
  'Won': "default",
  'Lost': "destructive",
};

export function ClientList() {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [interactions, setInteractions] = useState<Interaction[]>(INTERACTIONS);
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
    defaultValues: { name: "", email: "", company: "", status: "Lead", tags: "" },
  });

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || client.status === statusFilter)
    );
  }, [clients, searchTerm, statusFilter]);

  const handleOpenInteractions = (client: Client) => {
    setSelectedClient(client);
    setIsInteractionSheetOpen(true);
  };

  const handleAddInteraction = (interaction: Interaction) => {
    setInteractions((prev) => [interaction, ...prev]);
  };
  
  const handleOpenForm = (client: Client | null) => {
    setEditingClient(client);
    if (client) {
      form.reset({
        name: client.name,
        email: client.email,
        company: client.company,
        status: client.status,
        tags: client.tags.join(", "),
      });
    } else {
      form.reset({ name: "", email: "", company: "", status: "Lead", tags: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: ClientFormData) => {
    if (editingClient) {
      // Edit
      const updatedClient: Client = {
        ...editingClient,
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      };
      setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
      toast({ title: "Client Updated", description: `${data.name} has been updated.`});
    } else {
      // Create
      const newClient: Client = {
        id: `client_${Date.now()}`,
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
        avatarUrl: `https://picsum.photos/seed/crm-user-${Date.now()}/100/100`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setClients([newClient, ...clients]);
      toast({ title: "Client Created", description: `${data.name} has been added.`});
    }
    setIsFormModalOpen(false);
  };
  
  const handleOpenDeleteDialog = (clientId: string) => {
    setDeletingClientId(clientId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteClient = () => {
    if (deletingClientId) {
      setClients(clients.filter(c => c.id !== deletingClientId));
      toast({ title: "Client Deleted", variant: "destructive" });
      setDeletingClientId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search clients by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === "all" ? "Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                {clientStatuses.map(status => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>{status}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={client.avatarUrl}
                        alt={client.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint="person portrait"
                      />
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status]}>{client.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{client.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenInteractions(client)}>
                          <Eye className="mr-2 h-4 w-4" /> View Interactions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenForm(client)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteDialog(client.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
          interactions={interactions.filter(i => i.clientId === selectedClient.id)}
          isOpen={isInteractionSheetOpen}
          onOpenChange={setIsInteractionSheetOpen}
          onAddInteraction={handleAddInteraction}
        />
      )}

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update the details for this client.' : 'Fill in the details for the new client.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="company" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {clientStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="tags" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl><Input placeholder="enterprise, q2-target, etc." {...field} /></FormControl>
                  <FormDescription>Comma-separated tags for categorization.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete the client.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteClient}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
