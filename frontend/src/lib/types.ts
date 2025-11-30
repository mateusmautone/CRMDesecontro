export type ClientStatus =
  | "Convidado"
  | "Em conversa"
  | "Em negociação"
  | "Confirmado"
  | "Cancelado";

export type ClientType = "Brechó" | "DJ" | "Food" | "Patrocínio" | "Outro";

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  instagram?: string;
  phone?: string;
  city?: string;
  portfolioUrl?: string;
  notes?: string;
  avatarUrl: string;
  status: ClientStatus;
  type: ClientType;
  tags: string[];
  createdAt: string;
};

export type Interaction = {
  id: string;
  clientId: string;
  date: string;
  notes: string;
  summary?: string;
};

export type NegotiationStatus =
  | "Pendente"
  | "Ativa"
  | "Fechada - Ganhos"
  | "Fechada - Perdida";

export type Negotiation = {
  id: string;
  clientId: string;
  clientName: string;
  status: NegotiationStatus;
  agreementDetails: string;
  lastUpdated: string;
};

// Leads (backend-driven)

export type LeadStatusBackend = "new" | "contacted" | "qualified" | "lost";

export type Lead = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  status: LeadStatusBackend;
  createdAt: string;
  updatedAt: string;
};
