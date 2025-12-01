import express from 'express';
import request from 'supertest';

const mockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../src/repositories/interactions-repository', () => ({
  InteractionsRepository: jest.fn().mockImplementation(() => mockMethods),
}));

import interactionsRouter from './interactions';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', interactionsRouter);
  return app;
}

describe('interactions routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/ passes query filters', async () => {
    mockMethods.findAll.mockResolvedValueOnce([{ id: '1' }]);
    const res = await request(buildApp()).get('/api/').query({ clientId: 'c1' }).expect(200);
    expect(res.body).toEqual([{ id: '1' }]);
  });

  it('POST /api/ returns 400 on invalid body', async () => {
    const res = await request(buildApp()).post('/api/').send({}).expect(400);
    expect(res.status).toBe(400);
  });

  it('PATCH /api/:id returns 404 when update throws', async () => {
    mockMethods.update.mockImplementationOnce(() => { throw new Error('no'); });
    const res = await request(buildApp()).patch('/api/1').send({ content: 'x' }).expect(404);
    expect(res.status).toBe(404);
  });

  it('DELETE /api/:id returns 204 on success', async () => {
    mockMethods.delete.mockResolvedValueOnce(undefined);
    const res = await request(buildApp()).delete('/api/1').expect(204);
    expect(res.status).toBe(204);
  });
});
