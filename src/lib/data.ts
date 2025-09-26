import type { Client, Interaction, Negotiation } from './types';
import { PlaceHolderImages } from './placeholder-images';

let avatarIndex = 0;
const randomAvatar = () => {
    const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar'));
    const avatar = avatars[avatarIndex % avatars.length].imageUrl;
    avatarIndex++;
    return avatar;
}

export const CLIENTS: Client[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Innovate Corp', avatarUrl: randomAvatar(), status: 'Negociando', tags: ['enterprise', 'q2-target'], createdAt: '2023-05-10' },
  { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', company: 'Tech Solutions', avatarUrl: randomAvatar(), status: 'Ganho', tags: ['smb', 'fast-close'], createdAt: '2023-04-22' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', company: 'Data Systems', avatarUrl: randomAvatar(), status: 'Lead', tags: ['new-lead'], createdAt: '2023-05-18' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', company: 'Future Gadgets', avatarUrl: randomAvatar(), status: 'Contactado', tags: ['follow-up'], createdAt: '2023-05-01' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@example.com', company: 'SecureNet', avatarUrl: randomAvatar(), status: 'Perdido', tags: ['competitor'], createdAt: '2023-03-15' },
  { id: '6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', company: 'Global Exports', avatarUrl: randomAvatar(), status: 'Negociando', tags: ['international', 'high-value'], createdAt: '2023-05-05' },
  { id: '7', name: 'George Costanza', email: 'george.c@example.com', company: 'Vandelay Industries', avatarUrl: randomAvatar(), status: 'Lead', tags: ['new-lead'], createdAt: '2023-05-20' },
  { id: '8', name: 'Hannah Abbott', email: 'hannah.a@example.com', company: 'Magic Foods', avatarUrl: randomAvatar(), status: 'Contactado', tags: ['referral'], createdAt: '2023-05-12' },
];

export const INTERACTIONS: Interaction[] = [
  { id: 'int1', clientId: '1', date: '2023-05-15', notes: 'Chamada de demonstração inicial. Cliente ficou impressionado com os recursos A e B. Acompanhar na próxima semana com um orçamento.', summary: 'Chamada de demonstração positiva.' },
  { id: 'int2', clientId: '2', date: '2023-04-25', notes: 'Contrato assinado. Integração agendada.', summary: 'Negócio fechado.' },
  { id: 'int3', clientId: '4', date: '2023-05-03', notes: 'E-mail de acompanhamento enviado com informações de preços. Aguardando resposta.', summary: 'E-mail com preços enviado.' },
  { id: 'int4', clientId: '6', date: '2023-05-11', notes: 'Chamada de negociação. Discutidos os níveis de preços e pacotes de suporte.', summary: 'Negociação de preços.' },
];

export const NEGOTIATIONS: Negotiation[] = [
  { id: 'neg1', clientId: '1', clientName: 'Alice Johnson', status: 'Ativa', agreementDetails: 'Discutindo Plano Enterprise com 15% de desconto.', lastUpdated: '2023-05-15' },
  { id: 'neg2', clientId: '6', clientName: 'Fiona Glenanne', status: 'Ativa', agreementDetails: 'Finalizando termos para licença global.', lastUpdated: '2023-05-11' },
  { id: 'neg3', clientId: '2', clientName: 'Bob Williams', status: 'Fechada - Ganhos', agreementDetails: 'Plano SMB, contrato de 2 anos.', lastUpdated: '2023-04-25' },
  { id: 'neg4', clientId: '5', clientName: 'Ethan Hunt', status: 'Fechada - Perdida', agreementDetails: 'Cliente escolheu concorrente devido ao preço.', lastUpdated: '2023-03-15' },
  { id: 'neg5', clientId: '4', clientName: 'Diana Prince', status: 'Pendente', agreementDetails: 'Aguardando feedback do cliente sobre a proposta inicial.', lastUpdated: '2023-05-03' },
];
