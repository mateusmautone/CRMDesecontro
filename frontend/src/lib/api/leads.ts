import { apiGet, apiPost, apiPatch, apiDelete } from "../api";

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export type LeadDTO = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateLeadInput = {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
};

export type UpdateLeadInput = Partial<CreateLeadInput>;

export async function listLeads(): Promise<LeadDTO[]> {
  return apiGet<LeadDTO[]>("/api/v1/leads");
}

export async function getLead(id: string): Promise<LeadDTO> {
  return apiGet<LeadDTO>(`/api/v1/leads/${id}`);
}

export async function createLead(input: CreateLeadInput): Promise<LeadDTO> {
  return apiPost<LeadDTO, CreateLeadInput>("/api/v1/leads", input);
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<LeadDTO> {
  return apiPatch<LeadDTO, UpdateLeadInput>(`/api/v1/leads/${id}`, input);
}

export async function deleteLead(id: string): Promise<void> {
  return apiDelete(`/api/v1/leads/${id}`);
}
