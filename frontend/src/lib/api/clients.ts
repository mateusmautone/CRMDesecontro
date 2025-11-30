import { apiGet, apiPost, apiPatch, apiDelete } from "../api";

export type ClientDTO = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateClientInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  type?: string;
  tags?: string[];
};

export type UpdateClientInput = Partial<CreateClientInput>;

export async function listClients(): Promise<ClientDTO[]> {
  return apiGet<ClientDTO[]>("/api/v1/clients");
}

export async function getClient(id: string): Promise<ClientDTO> {
  return apiGet<ClientDTO>(`/api/v1/clients/${id}`);
}

export async function createClient(input: CreateClientInput): Promise<ClientDTO> {
  return apiPost<ClientDTO, CreateClientInput>("/api/v1/clients", input);
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<ClientDTO> {
  return apiPatch<ClientDTO, UpdateClientInput>(`/api/v1/clients/${id}`, input);
}

export async function deleteClient(id: string): Promise<void> {
  return apiDelete(`/api/v1/clients/${id}`);
}
