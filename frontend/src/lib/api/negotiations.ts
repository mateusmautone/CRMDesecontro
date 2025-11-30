import { apiGet, apiPost, apiPatch, apiDelete } from "../api";

export type NegotiationDTO = {
  id: string;
  title: string;
  description?: string | null;
  value?: number | null;
  status: string; // open, won, lost
  leadId?: string | null;
  clientId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateNegotiationInput = {
  title: string;
  description?: string;
  value?: number;
  status?: string;
  leadId?: string;
  clientId?: string;
};

export type UpdateNegotiationInput = Partial<CreateNegotiationInput>;

export async function listNegotiations(): Promise<NegotiationDTO[]> {
  return apiGet<NegotiationDTO[]>("/api/v1/negotiations");
}

export async function getNegotiation(id: string): Promise<NegotiationDTO> {
  return apiGet<NegotiationDTO>(`/api/v1/negotiations/${id}`);
}

export async function createNegotiation(input: CreateNegotiationInput): Promise<NegotiationDTO> {
  return apiPost<NegotiationDTO, CreateNegotiationInput>("/api/v1/negotiations", input);
}

export async function updateNegotiation(id: string, input: UpdateNegotiationInput): Promise<NegotiationDTO> {
  return apiPatch<NegotiationDTO, UpdateNegotiationInput>(`/api/v1/negotiations/${id}`, input);
}

export async function deleteNegotiation(id: string): Promise<void> {
  return apiDelete(`/api/v1/negotiations/${id}`);
}
