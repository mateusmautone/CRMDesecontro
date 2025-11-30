import { apiGet, apiPost, apiPatch, apiDelete } from "../api";

export type InteractionDTO = {
  id: string;
  type: string; // call, email, meeting, note
  content: string;
  leadId?: string | null;
  clientId?: string | null;
  negotiationId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInteractionInput = {
  type: string;
  content: string;
  leadId?: string;
  clientId?: string;
  negotiationId?: string;
};

export type UpdateInteractionInput = Partial<CreateInteractionInput>;

export async function listInteractions(params?: { clientId?: string; leadId?: string; negotiationId?: string }): Promise<InteractionDTO[]> {
  const search = new URLSearchParams();
  if (params?.clientId) search.set('clientId', params.clientId);
  if (params?.leadId) search.set('leadId', params.leadId);
  if (params?.negotiationId) search.set('negotiationId', params.negotiationId);
  const qs = search.toString();
  return apiGet<InteractionDTO[]>(`/api/v1/interactions${qs ? '?' + qs : ''}`);
}

export async function getInteraction(id: string): Promise<InteractionDTO> {
  return apiGet<InteractionDTO>(`/api/v1/interactions/${id}`);
}

export async function createInteraction(input: CreateInteractionInput): Promise<InteractionDTO> {
  return apiPost<InteractionDTO, CreateInteractionInput>("/api/v1/interactions", input);
}

export async function updateInteraction(id: string, input: UpdateInteractionInput): Promise<InteractionDTO> {
  return apiPatch<InteractionDTO, UpdateInteractionInput>(`/api/v1/interactions/${id}`, input);
}

export async function deleteInteraction(id: string): Promise<void> {
  return apiDelete(`/api/v1/interactions/${id}`);
}