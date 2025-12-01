import express from 'express';
import request from 'supertest';

const mockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../src/repositories/leads-repository', () => ({
  LeadsRepository: jest.fn().mockImplementation(() => mockMethods),
}));

import leadsRouter from './leads';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', leadsRouter);
  return app;
}

describe('leads routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /api/ returns 201 on valid', async () => {
    const payload = { name: 'L' };
    mockMethods.create.mockResolvedValueOnce({ id: 'a', ...payload });
    const res = await request(buildApp()).post('/api/').send(payload).expect(201);
    expect(res.body.id).toBe('a');
  });

  it('POST /api/ returns 400 on invalid', async () => {
    const res = await request(buildApp()).post('/api/').send({ email: 'x' }).expect(400);
    expect(res.status).toBe(400);
  });

  it('PATCH /api/:id returns 404 when update throws', async () => {
    mockMethods.update.mockImplementationOnce(() => { throw new Error('no'); });
    const res = await request(buildApp()).patch('/api/1').send({ name: 'X' }).expect(404);
    expect(res.status).toBe(404);
  });

  it('DELETE /api/:id returns 204 on success', async () => {
    mockMethods.delete.mockResolvedValueOnce(undefined);
    const res = await request(buildApp()).delete('/api/1').expect(204);
    expect(res.status).toBe(204);
  });
});
