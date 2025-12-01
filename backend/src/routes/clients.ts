import { Router } from "express";
import { z } from "zod";
import { ClientsRepository } from "../repositories/clients-repository.js";

const router = Router();
const repo = new ClientsRepository();

router.get("/", async (_req, res) => {
  const items = await repo.findAll();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await repo.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Client not found" });
  res.json(item);
});

const statusEnum = [
  "invited",
  "conversing",
  "negotiating",
  "confirmed",
  "cancelled",
] as const;
const typeEnum = ["thrift", "dj", "food", "sponsorship", "other"] as const;

const CreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(statusEnum).optional(),
  type: z.enum(typeEnum).optional(),
  tags: z.array(z.string().min(1)).optional(),
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
    res.status(404).json({ error: "Client not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await repo.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Client not found" });
  }
});

export default router;
