import { Router } from 'express';
import { z } from 'zod';
import { LeadsRepository } from '../repositories/leads-repository.js';

const router = Router();
const repo = new LeadsRepository();

router.get('/', async (_req, res) => {
  const items = await repo.findAll();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await repo.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(item);
});

const LeadCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
});

router.post('/', async (req, res) => {
  const parsed = LeadCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const created = await repo.create(parsed.data);
  res.status(201).json(created);
});

const LeadUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
});

router.patch('/:id', async (req, res) => {
  const parsed = LeadUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  try {
    const updated = await repo.update(req.params.id, parsed.data);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Lead not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await repo.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Lead not found' });
  }
});

export default router;
