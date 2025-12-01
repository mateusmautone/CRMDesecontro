import { prisma } from "../lib/prisma.js";

// Seed mínimo baseado nos mocks do frontend
const SAMPLE_LEADS = [
  {
    name: "Brechó Aurora",
    email: "contato@brechoaurora.com",
    phone: null,
    source: "Instagram",
    status: "new",
  },
  {
    name: "DJ Lira",
    email: "dj.lira@example.com",
    phone: null,
    source: "Indicação",
    status: "contacted",
  },
  {
    name: "Coletivo Vintage Club",
    email: "contato@vintageclub.com",
    phone: null,
    source: "Instagram",
    status: "qualified",
  },
  {
    name: "Truck Vegano Raiz",
    email: "contato@veganoraiz.com",
    phone: "+55 11 99999-0000",
    source: "Evento",
    status: "contacted",
  },
  {
    name: "Marca Urbana Flow",
    email: "parcerias@flowstreet.com",
    phone: null,
    source: "Parceria",
    status: "lost",
  },
];

const SAMPLE_CLIENTS = [
  {
    name: "Brechó Aurora",
    email: "contato@brechoaurora.com",
    phone: null,
    company: "Brechó Aurora",
    status: "confirmed",
    type: "thrift",
    tags: ["brecho", "moda", "sustentavel"],
  },
  {
    name: "DJ Lira",
    email: "dj.lira@example.com",
    phone: null,
    company: "DJ Lira",
    status: "negotiating",
    type: "dj",
    tags: ["musica", "lineup"],
  },
  {
    name: "Coletivo Vintage Club",
    email: "contato@vintageclub.com",
    phone: null,
    company: "Vintage Club",
    status: "conversing",
    type: "thrift",
    tags: ["vintage"],
  },
  {
    name: "Truck Vegano Raiz",
    email: "contato@veganoraiz.com",
    phone: "+55 11 99999-0000",
    company: "Vegano Raiz",
    status: "invited",
    type: "food",
    tags: ["vegan", "foodtruck"],
  },
  {
    name: "Marca Urbana Flow",
    email: "parcerias@flowstreet.com",
    phone: null,
    company: "Flow Streetwear",
    status: "cancelled",
    type: "sponsorship",
    tags: ["streetwear"],
  },
];

async function main() {
  console.log("Seeding leads...");
  for (const lead of SAMPLE_LEADS) {
    const email = lead.email;
    if (email) {
      const existing = await prisma.lead.findFirst({
        where: { email },
      });
      if (!existing) {
        await prisma.lead.create({
          data: {
            name: lead.name,
            email: lead.email ?? null,
            phone: lead.phone ?? null,
            source: lead.source ?? null,
            status: lead.status,
          },
        });
      }
    } else {
      await prisma.lead.create({
        data: {
          name: lead.name,
          email: null,
          phone: lead.phone ?? null,
          source: lead.source ?? null,
          status: lead.status,
        },
      });
    }
  }
  console.log("Seeding clients...");
  for (const client of SAMPLE_CLIENTS) {
    const email = client.email;
    if (email) {
      const existing = await prisma.client.findFirst({
        where: { email },
      });
      if (!existing) {
        await prisma.client.create({
          data: {
            name: client.name,
            email: client.email ?? null,
            phone: client.phone ?? null,
            company: client.company ?? null,
            status: client.status,
            type: client.type,
            tags: client.tags,
          },
        });
      }
    } else {
      await prisma.client.create({
        data: {
          name: client.name,
          email: null,
          phone: client.phone ?? null,
          company: client.company ?? null,
          status: client.status,
          type: client.type,
          tags: client.tags,
        },
      });
    }
  }
  console.log("Seed finalizado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
