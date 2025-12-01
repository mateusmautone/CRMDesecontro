import express from 'express';
import request from 'supertest';

const mockMethods = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../src/repositories/negotiations-repository', () => ({
  NegotiationsRepository: jest.fn().mockImplementation(() => mockMethods),
}));

import negotiationsRouter from './negotiations';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', negotiationsRouter);
  return app;
}

describe('negotiations routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /api/ returns 201 on valid', async () => {
    const payload = { title: 'Deal' };
    mockMethods.create.mockResolvedValueOnce({ id: 'n1', ...payload });
    const res = await request(buildApp()).post('/api/').send(payload).expect(201);
    expect(res.body.id).toBe('n1');
  });

  it('POST /api/ returns 400 on invalid', async () => {
    await request(buildApp()).post('/api/').send({}).expect(400);
  });

  it('PATCH /api/:id returns 404 when update throws', async () => {
    mockMethods.update.mockImplementationOnce(() => { throw new Error('no'); });
    await request(buildApp()).patch('/api/1').send({ status: 'won' }).expect(404);
  });

  it('DELETE /api/:id returns 204 on success', async () => {
    mockMethods.delete.mockResolvedValueOnce(undefined);
    await request(buildApp()).delete('/api/1').expect(204);
  });
});
