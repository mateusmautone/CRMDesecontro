import { randomUUID } from 'node:crypto';

export type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  createdAt: string;
};

export class LeadsService {
  private items: Lead[] = [];

  async list(): Promise<Lead[]> {
    return this.items;
  }

  async create(data: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const item: Lead = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.items.push(item);
    return item;
  }
}
