import { Router } from "express";
import { allResources } from "../controllers/integration.js";

const router = Router();

router.get("/all-resources", allResources);

export default router;