import { prisma } from '../lib/prisma';

export type LeadCreateInput = {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
};

export type LeadUpdateInput = Partial<LeadCreateInput>;

export class LeadsRepository {
  async findAll() {
    return prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.lead.findUnique({ where: { id } });
  }

  async create(data: LeadCreateInput) {
    return prisma.lead.create({ data });
  }

  async update(id: string, data: LeadUpdateInput) {
    return prisma.lead.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.lead.delete({ where: { id } });
  }
}
