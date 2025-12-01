import { prisma } from "../lib/prisma.js";

export type InteractionCreateInput = {
  type: string; // call, email, meeting, note
  content: string;
  leadId?: string;
  clientId?: string;
  negotiationId?: string;
};

export type InteractionUpdateInput = Partial<InteractionCreateInput>;

export class InteractionsRepository {
  async findAll(filters?: {
    clientId?: string;
    leadId?: string;
    negotiationId?: string;
  }) {
    const where: any = {};
    if (filters?.clientId) where.clientId = filters.clientId;
    if (filters?.leadId) where.leadId = filters.leadId;
    if (filters?.negotiationId) where.negotiationId = filters.negotiationId;
    return prisma.interaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
  async findById(id: string) {
    return prisma.interaction.findUnique({ where: { id } });
  }
  async create(data: InteractionCreateInput) {
    return prisma.interaction.create({ data });
  }
  async update(id: string, data: InteractionUpdateInput) {
    return prisma.interaction.update({ where: { id }, data });
  }
  async delete(id: string) {
    return prisma.interaction.delete({ where: { id } });
  }
}
