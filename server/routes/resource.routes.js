import { Router } from "express";
import { allResources, getUnitSchedule } from '../controllers/resources.js'

const router = Router();

router.get("/all-resources", allResources);
router.get("/unit-schedule", getUnitSchedule);

export default router;
