import { prisma } from "../lib/prisma";

export type NegotiationCreateInput = {
  title: string;
  description?: string;
  value?: number;
  status?: string; // open, won, lost
  leadId?: string;
  clientId?: string;
};

export type NegotiationUpdateInput = Partial<NegotiationCreateInput>;

export class NegotiationsRepository {
  async findAll() {
    return prisma.negotiation.findMany({ orderBy: { createdAt: "desc" } });
  }
  async findById(id: string) {
    return prisma.negotiation.findUnique({ where: { id } });
  }
  async create(data: NegotiationCreateInput) {
    return prisma.negotiation.create({ data });
  }
  async update(id: string, data: NegotiationUpdateInput) {
    return prisma.negotiation.update({ where: { id }, data });
  }
  async delete(id: string) {
    return prisma.negotiation.delete({ where: { id } });
  }
}
