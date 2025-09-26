export type ClientStatus = 'Lead' | 'Contactado' | 'Negociando' | 'Ganho' | 'Perdido';

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  avatarUrl: string;
  status: ClientStatus;
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

export type NegotiationStatus = 'Pendente' | 'Ativa' | 'Fechada - Ganhos' | 'Fechada - Perdida';

export type Negotiation = {
  id: string;
  clientId: string;
  clientName: string;
  status: NegotiationStatus;
  agreementDetails: string;
  lastUpdated: string;
};
