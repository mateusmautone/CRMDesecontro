import { Router } from "express";
import { z } from "zod";
import { InteractionsRepository } from "../repositories/interactions-repository.js";

const router = Router();
const repo = new InteractionsRepository();

router.get("/", async (req, res) => {
  const { clientId, leadId, negotiationId } = req.query as Record<
    string,
    string | undefined
  >;
  const items = await repo.findAll({ clientId, leadId, negotiationId });
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await repo.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Interaction not found" });
  res.json(item);
});

const CreateSchema = z.object({
  type: z.string().min(1),
  content: z.string().min(1),
  leadId: z.string().optional(),
  clientId: z.string().optional(),
  negotiationId: z.string().optional(),
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
    res.status(404).json({ error: "Interaction not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await repo.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Interaction not found" });
  }
});

export default router;
