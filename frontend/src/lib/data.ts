import type { Client, Interaction, Negotiation } from "./types";
import { PlaceHolderImages } from "./placeholder-images";

let avatarIndex = 0;
const randomAvatar = () => {
  const avatars = PlaceHolderImages.filter((img) =>
    img.id.startsWith("avatar")
  );
  const avatar = avatars[avatarIndex % avatars.length].imageUrl;
  avatarIndex++;
  return avatar;
};

export const CLIENTS: Client[] = [
  {
    id: "1",
    name: "Brechó Aurora",
    email: "contato@brechoaurora.com",
    company: "Brechó Aurora",
    instagram: "@brechoaurora",
    city: "São Paulo - Centro",
    avatarUrl: randomAvatar(),
    status: "Em negociação",
    type: "Brechó",
    tags: ["streetwear", "vintage", "edição-passada"],
    createdAt: "2023-05-10",
  },
  {
    id: "2",
    name: "DJ Lira",
    email: "dj.lira@example.com",
    company: "DJ Lira",
    instagram: "@djlira",
    portfolioUrl: "https://soundcloud.com/djlira",
    avatarUrl: randomAvatar(),
    status: "Confirmado",
    type: "DJ",
    tags: ["hiphop", "trap", "noite"],
    createdAt: "2023-04-22",
  },
  {
    id: "3",
    name: "Coletivo Vintage Club",
    email: "contato@vintageclub.com",
    company: "Vintage Club",
    instagram: "@vintageclub",
    city: "São Paulo - Zona Oeste",
    avatarUrl: randomAvatar(),
    status: "Convidado",
    type: "Brechó",
    tags: ["vintage", "acessórios"],
    createdAt: "2023-05-18",
  },
  {
    id: "4",
    name: "Truck Vegano Raiz",
    email: "contato@veganoraiz.com",
    company: "Vegano Raiz",
    instagram: "@veganoraiz",
    phone: "+55 11 99999-0000",
    avatarUrl: randomAvatar(),
    status: "Em conversa",
    type: "Food",
    tags: ["vegano", "comida-de-rua"],
    createdAt: "2023-05-01",
  },
  {
    id: "5",
    name: "Marca Urbana Flow",
    email: "parcerias@flowstreet.com",
    company: "Flow Streetwear",
    instagram: "@flowstreet",
    notes: "Possível collab em cápsula exclusiva para o evento.",
    avatarUrl: randomAvatar(),
    status: "Cancelado",
    type: "Patrocínio",
    tags: ["patrocínio", "collab"],
    createdAt: "2023-03-15",
  },
  {
    id: "6",
    name: "DJ Mina",
    email: "dj.mina@example.com",
    company: "DJ Mina",
    instagram: "@djminasounds",
    portfolioUrl: "https://soundcloud.com/djmina",
    avatarUrl: randomAvatar(),
    status: "Em negociação",
    type: "DJ",
    tags: ["r&b", "hiphop"],
    createdAt: "2023-05-05",
  },
  {
    id: "7",
    name: "Brechó Garimpo Fino",
    email: "garimpo.fino@example.com",
    company: "Garimpo Fino",
    instagram: "@garimpofino",
    avatarUrl: randomAvatar(),
    status: "Convidado",
    type: "Brechó",
    tags: ["curadoria", "peças-únicas"],
    createdAt: "2023-05-20",
  },
  {
    id: "8",
    name: "Açaí da Quebrada",
    email: "contato@acaidaquebrada.com",
    company: "Açaí da Quebrada",
    instagram: "@acaidaquebrada",
    phone: "+55 11 98888-7777",
    avatarUrl: randomAvatar(),
    status: "Em conversa",
    type: "Food",
    tags: ["açai", "sobremesa"],
    createdAt: "2023-05-12",
  },
];

export const INTERACTIONS: Interaction[] = [
  {
    id: "int1",
    clientId: "1",
    date: "2023-05-15",
    notes:
      "Chamada de demonstração inicial. Cliente ficou impressionado com os recursos A e B. Acompanhar na próxima semana com um orçamento.",
    summary: "Chamada de demonstração positiva.",
  },
  {
    id: "int2",
    clientId: "2",
    date: "2023-04-25",
    notes: "Contrato assinado. Integração agendada.",
    summary: "Negócio fechado.",
  },
  {
    id: "int3",
    clientId: "4",
    date: "2023-05-03",
    notes:
      "E-mail de acompanhamento enviado com informações de preços. Aguardando resposta.",
    summary: "E-mail com preços enviado.",
  },
  {
    id: "int4",
    clientId: "6",
    date: "2023-05-11",
    notes:
      "Chamada de negociação. Discutidos os níveis de preços e pacotes de suporte.",
    summary: "Negociação de preços.",
  },
];

export const NEGOTIATIONS: Negotiation[] = [
  {
    id: "neg1",
    clientId: "1",
    clientName: "Alice Johnson",
    status: "Ativa",
    agreementDetails: "Discutindo Plano Enterprise com 15% de desconto.",
    lastUpdated: "2023-05-15",
  },
  {
    id: "neg2",
    clientId: "6",
    clientName: "Fiona Glenanne",
    status: "Ativa",
    agreementDetails: "Finalizando termos para licença global.",
    lastUpdated: "2023-05-11",
  },
  {
    id: "neg3",
    clientId: "2",
    clientName: "Bob Williams",
    status: "Fechada - Ganhos",
    agreementDetails: "Plano SMB, contrato de 2 anos.",
    lastUpdated: "2023-04-25",
  },
  {
    id: "neg4",
    clientId: "5",
    clientName: "Ethan Hunt",
    status: "Fechada - Perdida",
    agreementDetails: "Cliente escolheu concorrente devido ao preço.",
    lastUpdated: "2023-03-15",
  },
  {
    id: "neg5",
    clientId: "4",
    clientName: "Diana Prince",
    status: "Pendente",
    agreementDetails:
      "Aguardando feedback do cliente sobre a proposta inicial.",
    lastUpdated: "2023-05-03",
  },
];
