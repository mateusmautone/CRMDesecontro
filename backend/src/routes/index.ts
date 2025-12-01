import { Router } from "express";
import leads from "./leads.js";
import clients from "./clients.js";
import negotiations from "./negotiations.js";
import interactions from "./interactions.js";

const router = Router();

router.use("/leads", leads);
router.use("/clients", clients);
router.use("/negotiations", negotiations);
router.use("/interactions", interactions);

export default router;
