import request from 'supertest';

// We'll mock repositories before importing the app so route modules use the mocks
jest.resetModules();

const clientsMockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const leadsMockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const interactionsMockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const negotiationsMockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('./repositories/clients-repository', () => ({
  ClientsRepository: jest.fn().mockImplementation(() => clientsMockMethods),
}));
jest.mock('./repositories/leads-repository', () => ({
  LeadsRepository: jest.fn().mockImplementation(() => leadsMockMethods),
}));
jest.mock('./repositories/interactions-repository', () => ({
  InteractionsRepository: jest.fn().mockImplementation(() => interactionsMockMethods),
}));
jest.mock('./repositories/negotiations-repository', () => ({
  NegotiationsRepository: jest.fn().mockImplementation(() => negotiationsMockMethods),
}));

import { createApp } from './app';

describe('createApp integration', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CORS_ORIGIN = '*';
    app = createApp();
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('crmdesecontro-backend');
    expect(typeof res.body.time).toBe('string');
  });

  it('GET /api/v1/clients returns list', async () => {
    clientsMockMethods.findAll.mockResolvedValueOnce([{ id: '1', name: 'C' }]);
    const res = await request(app).get('/api/v1/clients').expect(200);
    expect(res.body).toEqual([{ id: '1', name: 'C' }]);
    expect(clientsMockMethods.findAll).toHaveBeenCalled();
  });

  it('GET /api/v1/clients/:id returns 404 when not found', async () => {
    clientsMockMethods.findById.mockResolvedValueOnce(null);
    await request(app).get('/api/v1/clients/nonexistent').expect(404);
    expect(clientsMockMethods.findById).toHaveBeenCalledWith('nonexistent');
  });

  it('POST /api/v1/leads returns 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/api/v1/leads')
      .send({ email: 'no-name' })
      .expect(400);
    expect(res.body.error).toBe('Invalid payload');
  });

  it('POST /api/v1/leads triggers error handler on repo throw', async () => {
    leadsMockMethods.create.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    const res = await request(app)
      .post('/api/v1/leads')
      .send({ name: 'A' })
      .expect(500);
    expect(res.body.error).toBe('Internal Server Error');
  });

  it('PATCH /api/v1/clients/:id returns 404 when repo.update throws', async () => {
    clientsMockMethods.update.mockImplementationOnce(() => {
      throw new Error('not found');
    });
    const res = await request(app)
      .patch('/api/v1/clients/1')
      .send({ name: 'X' })
      .expect(404);
    expect(res.body.error).toBe('Client not found');
  });

  it('DELETE /api/v1/negotiations/:id returns 404 when repo.delete throws', async () => {
    negotiationsMockMethods.delete.mockImplementationOnce(() => {
      throw new Error('not found');
    });
    await request(app).delete('/api/v1/negotiations/1').expect(404);
  });

  it('unknown route returns 404 Not Found', async () => {
    const res = await request(app).get('/some/random/route').expect(404);
    expect(res.body.error).toBe('Not Found');
  });
});
