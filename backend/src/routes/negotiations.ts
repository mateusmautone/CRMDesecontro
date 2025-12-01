import { Router } from "express";
import { z } from "zod";
import { NegotiationsRepository } from "../repositories/negotiations-repository.js";

const router = Router();
const repo = new NegotiationsRepository();

router.get("/", async (_req, res) => {
  const items = await repo.findAll();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await repo.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Negotiation not found" });
  res.json(item);
});

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  value: z.number().optional(),
  status: z.string().optional(),
  leadId: z.string().optional(),
  clientId: z.string().optional(),
});

router.post("/", async (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const created = await repo.create(parsed.data);
  res.status(201).json(created);
});

const UpdateSchema = CreateSchema.partial();

router.patch("/:id", async (req, res) => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  try {
    const updated = await repo.update(req.params.id, parsed.data);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: "Negotiation not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await repo.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Negotiation not found" });
  }
});

export default router;
