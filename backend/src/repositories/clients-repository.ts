import { prisma } from "../lib/prisma.js";

export type ClientCreateInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string; // invited, conversing, negotiating, confirmed, cancelled
  type?: string; // thrift, dj, food, sponsorship, other
  tags?: string[];
};

export type ClientUpdateInput = Partial<ClientCreateInput>;

export class ClientsRepository {
  async findAll() {
    return prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  }
  async findById(id: string) {
    return prisma.client.findUnique({ where: { id } });
  }
  async create(data: ClientCreateInput) {
    return prisma.client.create({ data: { ...data, tags: data.tags ?? [] } });
  }
  async update(id: string, data: ClientUpdateInput) {
    return prisma.client.update({ where: { id }, data });
  }
  async delete(id: string) {
    return prisma.client.delete({ where: { id } });
  }
}
