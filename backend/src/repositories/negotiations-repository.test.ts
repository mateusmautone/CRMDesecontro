import { NegotiationsRepository } from '../repositories/negotiations-repository';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    negotiation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('NegotiationsRepository', () => {
  let negotiationsRepository: NegotiationsRepository;

  beforeEach(() => {
    negotiationsRepository = new NegotiationsRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all negotiations ordered by createdAt descending', async () => {
      const mockNegotiations = [
        {
          id: '1',
          title: 'Deal 1',
          description: 'First negotiation',
          value: 5000,
          status: 'open',
          leadId: 'lead1',
          clientId: undefined,
          createdAt: new Date('2025-01-02'),
        },
        {
          id: '2',
          title: 'Deal 2',
          description: 'Second negotiation',
          value: 10000,
          status: 'won',
          leadId: undefined,
          clientId: 'client1',
          createdAt: new Date('2025-01-01'),
        },
      ];

      jest
        .mocked(prisma.negotiation.findMany)
        .mockResolvedValueOnce(mockNegotiations as any);

      const result = await negotiationsRepository.findAll();

      expect(prisma.negotiation.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockNegotiations);
    });

    it('should return empty array when no negotiations exist', async () => {
      jest.mocked(prisma.negotiation.findMany).mockResolvedValueOnce([]);

      const result = await negotiationsRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a negotiation by id', async () => {
      const mockNegotiation = {
        id: '1',
        title: 'Important Deal',
        value: 15000,
        status: 'open',
      };

      jest
        .mocked(prisma.negotiation.findUnique)
        .mockResolvedValueOnce(mockNegotiation as any);

      const result = await negotiationsRepository.findById('1');

      expect(prisma.negotiation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockNegotiation);
    });

    it('should return null when negotiation does not exist', async () => {
      jest.mocked(prisma.negotiation.findUnique).mockResolvedValueOnce(null);

      const result = await negotiationsRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new negotiation', async () => {
      const input = {
        title: 'New Deal',
        description: 'Potential partnership',
        value: 20000,
        status: 'open',
        clientId: 'client1',
      };

      const mockCreatedNegotiation = {
        id: '3',
        ...input,
        leadId: undefined,
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.negotiation.create)
        .mockResolvedValueOnce(mockCreatedNegotiation as any);

      const result = await negotiationsRepository.create(input);

      expect(prisma.negotiation.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockCreatedNegotiation);
    });

    it('should handle minimal input', async () => {
      const input = { title: 'Quick Deal' };

      const mockCreatedNegotiation = {
        id: '4',
        title: 'Quick Deal',
        description: undefined,
        value: undefined,
        status: undefined,
        leadId: undefined,
        clientId: undefined,
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.negotiation.create)
        .mockResolvedValueOnce(mockCreatedNegotiation as any);

      const result = await negotiationsRepository.create(input);

      expect(result.title).toBe('Quick Deal');
    });
  });

  describe('update', () => {
    it('should update a negotiation by id', async () => {
      const updateData = {
        status: 'won',
        value: 25000,
      };

      const mockUpdatedNegotiation = {
        id: '1',
        title: 'Important Deal',
        description: 'Updated deal',
        ...updateData,
        leadId: 'lead1',
        clientId: undefined,
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.negotiation.update)
        .mockResolvedValueOnce(mockUpdatedNegotiation as any);

      const result = await negotiationsRepository.update('1', updateData);

      expect(prisma.negotiation.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result.status).toBe('won');
      expect(result.value).toBe(25000);
    });

    it('should update only specified fields', async () => {
      const updateData = { status: 'lost' };

      const mockUpdatedNegotiation = {
        id: '2',
        title: 'Deal 2',
        status: 'lost',
      };

      jest
        .mocked(prisma.negotiation.update)
        .mockResolvedValueOnce(mockUpdatedNegotiation as any);

      const result = await negotiationsRepository.update('2', updateData);

      expect(prisma.negotiation.update).toHaveBeenCalledWith({
        where: { id: '2' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete a negotiation by id', async () => {
      const mockDeletedNegotiation = {
        id: '1',
        title: 'Deleted Deal',
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.negotiation.delete)
        .mockResolvedValueOnce(mockDeletedNegotiation as any);

      const result = await negotiationsRepository.delete('1');

      expect(prisma.negotiation.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockDeletedNegotiation);
    });
  });
});
