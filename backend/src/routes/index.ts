import { Router } from "express";
import leads from "./leads";
import clients from "./clients";
import negotiations from "./negotiations";
import interactions from "./interactions";

const router = Router();

router.use("/leads", leads);
router.use("/clients", clients);
router.use("/negotiations", negotiations);
router.use("/interactions", interactions);

export default router;
