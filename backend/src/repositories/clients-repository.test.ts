import { ClientsRepository } from '../repositories/clients-repository';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  prisma: {
    client: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ClientsRepository', () => {
  let clientsRepository: ClientsRepository;

  beforeEach(() => {
    clientsRepository = new ClientsRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all clients ordered by createdAt descending', async () => {
      const mockClients = [
        {
          id: '1',
          name: 'Client 1',
          email: 'client1@example.com',
          createdAt: new Date('2025-01-02'),
        },
        {
          id: '2',
          name: 'Client 2',
          email: 'client2@example.com',
          createdAt: new Date('2025-01-01'),
        },
      ];

      jest
        .mocked(prisma.client.findMany)
        .mockResolvedValueOnce(mockClients as any);

      const result = await clientsRepository.findAll();

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockClients);
    });

    it('should return empty array when no clients exist', async () => {
      jest.mocked(prisma.client.findMany).mockResolvedValueOnce([]);

      const result = await clientsRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      const mockClient = {
        id: '1',
        name: 'Client 1',
        email: 'client1@example.com',
      };

      jest
        .mocked(prisma.client.findUnique)
        .mockResolvedValueOnce(mockClient as any);

      const result = await clientsRepository.findById('1');

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockClient);
    });

    it('should return null when client does not exist', async () => {
      jest.mocked(prisma.client.findUnique).mockResolvedValueOnce(null);

      const result = await clientsRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new client with default tags array', async () => {
      const input = {
        name: 'New Client',
        email: 'new@example.com',
        phone: '123456789',
      };

      const mockCreatedClient = {
        id: '3',
        ...input,
        company: undefined,
        status: undefined,
        type: undefined,
        tags: [],
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.client.create)
        .mockResolvedValueOnce(mockCreatedClient as any);

      const result = await clientsRepository.create(input);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...input,
          tags: [],
        },
      });
      expect(result).toEqual(mockCreatedClient);
    });

    it('should preserve tags if provided', async () => {
      const input = {
        name: 'Client with tags',
        tags: ['vip', 'active'],
      };

      const mockCreatedClient = {
        id: '4',
        name: 'Client with tags',
        email: undefined,
        phone: undefined,
        company: undefined,
        status: undefined,
        type: undefined,
        tags: ['vip', 'active'],
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.client.create)
        .mockResolvedValueOnce(mockCreatedClient as any);

      const result = await clientsRepository.create(input);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...input,
          tags: ['vip', 'active'],
        },
      });
      expect(result.tags).toEqual(['vip', 'active']);
    });
  });

  describe('update', () => {
    it('should update a client by id', async () => {
      const updateData = {
        name: 'Updated Name',
        status: 'confirmed',
      };

      const mockUpdatedClient = {
        id: '1',
        ...updateData,
        email: 'client1@example.com',
        phone: undefined,
        company: undefined,
        type: undefined,
        tags: [],
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.client.update)
        .mockResolvedValueOnce(mockUpdatedClient as any);

      const result = await clientsRepository.update('1', updateData);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedClient);
    });
  });

  describe('delete', () => {
    it('should delete a client by id', async () => {
      const mockDeletedClient = {
        id: '1',
        name: 'Deleted Client',
        createdAt: new Date(),
      };

      jest
        .mocked(prisma.client.delete)
        .mockResolvedValueOnce(mockDeletedClient as any);

      const result = await clientsRepository.delete('1');

      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockDeletedClient);
    });
  });
});
