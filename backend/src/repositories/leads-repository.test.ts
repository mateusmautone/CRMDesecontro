import { LeadsRepository } from '../repositories/leads-repository';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('LeadsRepository', () => {
  let leadsRepository: LeadsRepository;

  beforeEach(() => {
    leadsRepository = new LeadsRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all leads ordered by createdAt descending', async () => {
      const mockLeads = [
        {
          id: '1',
          name: 'Lead 1',
          email: 'lead1@example.com',
          createdAt: new Date('2025-01-02'),
        },
        {
          id: '2',
          name: 'Lead 2',
          email: 'lead2@example.com',
          createdAt: new Date('2025-01-01'),
        },
      ];

      jest
        .mocked(prisma.lead.findMany)
        .mockResolvedValueOnce(mockLeads as any);

      const result = await leadsRepository.findAll();

      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockLeads);
    });

    it('should return empty array when no leads exist', async () => {
      jest.mocked(prisma.lead.findMany).mockResolvedValueOnce([]);

      const result = await leadsRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a lead by id', async () => {
      const mockLead = {
        id: '1',
        name: 'Lead 1',
        email: 'lead1@example.com',
      };

      jest.mocked(prisma.lead.findUnique).mockResolvedValueOnce(mockLead as any);

      const result = await leadsRepository.findById('1');

      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockLead);
    });

    it('should return null when lead does not exist', async () => {
      jest.mocked(prisma.lead.findUnique).mockResolvedValueOnce(null);

      const result = await leadsRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new lead', async () => {
      const input = {
        name: 'New Lead',
        email: 'new@example.com',
        phone: '123456789',
        source: 'website',
      };

      const mockCreatedLead = {
        id: '3',
        ...input,
        status: undefined,
        createdAt: new Date(),
      };

      jest.mocked(prisma.lead.create).mockResolvedValueOnce(mockCreatedLead as any);

      const result = await leadsRepository.create(input);

      expect(prisma.lead.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockCreatedLead);
    });

    it('should handle minimal input', async () => {
      const input = { name: 'Minimal Lead' };

      const mockCreatedLead = {
        id: '4',
        name: 'Minimal Lead',
        email: undefined,
        phone: undefined,
        source: undefined,
        status: undefined,
        createdAt: new Date(),
      };

      jest.mocked(prisma.lead.create).mockResolvedValueOnce(mockCreatedLead as any);

      const result = await leadsRepository.create(input);

      expect(prisma.lead.create).toHaveBeenCalledWith({ data: input });
      expect(result.name).toBe('Minimal Lead');
    });
  });

  describe('update', () => {
    it('should update a lead by id', async () => {
      const updateData = {
        name: 'Updated Lead',
        status: 'confirmed',
      };

      const mockUpdatedLead = {
        id: '1',
        ...updateData,
        email: 'lead1@example.com',
        phone: undefined,
        source: undefined,
        createdAt: new Date(),
      };

      jest.mocked(prisma.lead.update).mockResolvedValueOnce(mockUpdatedLead as any);

      const result = await leadsRepository.update('1', updateData);

      expect(prisma.lead.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedLead);
    });

    it('should update only specified fields', async () => {
      const updateData = { status: 'negotiating' };

      const mockUpdatedLead = {
        id: '1',
        name: 'Lead 1',
        email: 'lead1@example.com',
        phone: undefined,
        source: undefined,
        status: 'negotiating',
        createdAt: new Date(),
      };

      jest.mocked(prisma.lead.update).mockResolvedValueOnce(mockUpdatedLead as any);

      const result = await leadsRepository.update('1', updateData);

      expect(prisma.lead.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result.status).toBe('negotiating');
    });
  });

  describe('delete', () => {
    it('should delete a lead by id', async () => {
      const mockDeletedLead = {
        id: '1',
        name: 'Deleted Lead',
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.lead.delete)
        .mockResolvedValueOnce(mockDeletedLead as any);

      const result = await leadsRepository.delete('1');

      expect(prisma.lead.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockDeletedLead);
    });
  });
});
