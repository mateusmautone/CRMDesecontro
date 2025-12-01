import express from 'express';
import request from 'supertest';

const mockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../src/repositories/clients-repository', () => ({
  ClientsRepository: jest.fn().mockImplementation(() => mockMethods),
}));

import clientsRouter from './clients';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', clientsRouter);
  return app;
}

describe('clients routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/ returns list', async () => {
    mockMethods.findAll.mockResolvedValueOnce([{ id: '1', name: 'A' }]);
    const res = await request(buildApp()).get('/api/').expect(200);
    expect(res.body).toEqual([{ id: '1', name: 'A' }]);
  });

  it('GET /api/:id returns 404 if not found', async () => {
    mockMethods.findById.mockResolvedValueOnce(null);
    const res = await request(buildApp()).get('/api/1').expect(404);
    expect(res.status).toBe(404);
  });

  it('POST /api/ returns 201 when valid', async () => {
    const payload = { name: 'New' };
    mockMethods.create.mockResolvedValueOnce({ id: 'x', ...payload });
    const res = await request(buildApp()).post('/api/').send(payload).expect(201);
    expect(res.body.id).toBe('x');
  });

  it('POST /api/ returns 400 when invalid', async () => {
    const res = await request(buildApp()).post('/api/').send({}).expect(400);
    expect(res.body.error).toBe('Invalid payload');
  });

  it('PATCH /api/:id returns 404 when update throws', async () => {
    mockMethods.update.mockImplementationOnce(() => { throw new Error('err'); });
    await request(buildApp()).patch('/api/1').send({ name: 'X' }).expect(404);
  });

  it('DELETE /api/:id returns 204 on success', async () => {
    mockMethods.delete.mockResolvedValueOnce(undefined);
    const res = await request(buildApp()).delete('/api/1').expect(204);
    expect(res.status).toBe(204);
  });
});
