import { Router } from "express";
import { allResources } from '../controllers/resources.js'

const router = Router();

router.get("/all-resources", allResources);

export default router;
