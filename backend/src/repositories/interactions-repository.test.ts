import { InteractionsRepository } from '../repositories/interactions-repository';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    interaction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('InteractionsRepository', () => {
  let interactionsRepository: InteractionsRepository;

  beforeEach(() => {
    interactionsRepository = new InteractionsRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all interactions without filters', async () => {
      const mockInteractions = [
        {
          id: '1',
          type: 'call',
          content: 'Discussion about project',
          clientId: 'client1',
          leadId: undefined,
          negotiationId: undefined,
          createdAt: new Date(),
        },
      ];

      jest
        .mocked(prisma.interaction.findMany)
        .mockResolvedValueOnce(mockInteractions as any);

      const result = await interactionsRepository.findAll();

      expect(prisma.interaction.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockInteractions);
    });

    it('should filter interactions by clientId', async () => {
      const mockInteractions = [
        {
          id: '1',
          type: 'email',
          content: 'Follow up email',
          clientId: 'client1',
          createdAt: new Date(),
        },
      ];

      jest
        .mocked(prisma.interaction.findMany)
        .mockResolvedValueOnce(mockInteractions as any);

      const result = await interactionsRepository.findAll({ clientId: 'client1' });

      expect(prisma.interaction.findMany).toHaveBeenCalledWith({
        where: { clientId: 'client1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockInteractions);
    });

    it('should filter interactions by leadId', async () => {
      const mockInteractions: any[] = [];

      jest
        .mocked(prisma.interaction.findMany)
        .mockResolvedValueOnce(mockInteractions as any);

      await interactionsRepository.findAll({ leadId: 'lead1' });

      expect(prisma.interaction.findMany).toHaveBeenCalledWith({
        where: { leadId: 'lead1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter interactions by negotiationId', async () => {
      jest
        .mocked(prisma.interaction.findMany)
        .mockResolvedValueOnce([]);

      await interactionsRepository.findAll({ negotiationId: 'neg1' });

      expect(prisma.interaction.findMany).toHaveBeenCalledWith({
        where: { negotiationId: 'neg1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('should return an interaction by id', async () => {
      const mockInteraction = {
        id: '1',
        type: 'meeting',
        content: 'Product discussion',
      };

      jest
        .mocked(prisma.interaction.findUnique)
        .mockResolvedValueOnce(mockInteraction as any);

      const result = await interactionsRepository.findById('1');

      expect(prisma.interaction.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockInteraction);
    });
  });

  describe('create', () => {
    it('should create a new interaction', async () => {
      const input = {
        type: 'note',
        content: 'Important note',
        clientId: 'client1',
      };

      const mockCreatedInteraction = {
        id: '2',
        ...input,
        leadId: undefined,
        negotiationId: undefined,
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.interaction.create)
        .mockResolvedValueOnce(mockCreatedInteraction as any);

      const result = await interactionsRepository.create(input);

      expect(prisma.interaction.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockCreatedInteraction);
    });
  });

  describe('update', () => {
    it('should update an interaction', async () => {
      const updateData = { content: 'Updated content' };

      const mockUpdatedInteraction = {
        id: '1',
        type: 'call',
        content: 'Updated content',
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.interaction.update)
        .mockResolvedValueOnce(mockUpdatedInteraction as any);

      const result = await interactionsRepository.update('1', updateData);

      expect(prisma.interaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result.content).toBe('Updated content');
    });
  });

  describe('delete', () => {
    it('should delete an interaction', async () => {
      const mockDeletedInteraction = { id: '1', type: 'call' };

      jest
        .mocked(prisma.interaction.delete)
        .mockResolvedValueOnce(mockDeletedInteraction as any);

      const result = await interactionsRepository.delete('1');

      expect(prisma.interaction.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockDeletedInteraction);
    });
  });
});
