import type { Client, Interaction, Negotiation } from './types';
import type { ClientDTO } from './api/clients';
import type { NegotiationDTO } from './api/negotiations';
import type { InteractionDTO } from './api/interactions';

// Mapeia ClientDTO (backend) para Client (frontend enriquecido)
// Como o backend ainda não possui status/type/tags/avatar, criamos defaults.
export function mapClientDtoToClient(dto: ClientDTO): Client {
  const statusMap: Record<string, Client['status']> = {
    invited: 'Convidado',
    conversing: 'Em conversa',
    negotiating: 'Em negociação',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
  };
  const typeMap: Record<string, Client['type']> = {
    thrift: 'Brechó',
    dj: 'DJ',
    food: 'Food',
    sponsorship: 'Patrocínio',
    other: 'Outro',
  };
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email ?? '',
    company: dto.company ?? dto.name,
    instagram: undefined,
    phone: dto.phone ?? undefined,
    city: undefined,
    portfolioUrl: undefined,
    notes: undefined,
    avatarUrl: `https://picsum.photos/seed/crm-client-${encodeURIComponent(dto.id)}/100/100`,
    status: statusMap[dto.status] || 'Convidado',
    type: typeMap[dto.type] || 'Outro',
    tags: dto.tags ?? [],
    createdAt: new Date(dto.createdAt).toISOString().split('T')[0],
  };
}

// Mapeia NegotiationDTO para Negotiation (UI) usando nome do cliente já resolvido externamente.
export function mapNegotiationDtoToNegotiation(dto: NegotiationDTO, clientName?: string): Negotiation {
  // status mapping backend -> UI
  const statusMap: Record<string, Negotiation['status']> = {
    open: 'Ativa',
    won: 'Fechada - Ganhos',
    lost: 'Fechada - Perdida',
  };
  return {
    id: dto.id,
    clientId: dto.clientId || '',
    clientName: clientName || '—',
    status: statusMap[dto.status] || 'Ativa',
    agreementDetails: dto.description || dto.title,
    lastUpdated: new Date(dto.updatedAt).toISOString().split('T')[0],
  };
}

// Mapeia InteractionDTO para Interaction (UI)
export function mapInteractionDtoToInteraction(dto: InteractionDTO): Interaction {
  return {
    id: dto.id,
    clientId: dto.clientId || '',
    date: new Date(dto.createdAt).toISOString().split('T')[0],
    notes: dto.content,
    summary: undefined,
  };
}
