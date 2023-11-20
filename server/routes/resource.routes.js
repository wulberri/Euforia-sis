import { Router } from "express";
import { allResources, getUnitSchedule } from '../controllers/resources.js'

const router = Router();

router.get("/all-resources", allResources);
router.get("/unit-schedule/:unitNumber", getUnitSchedule);

export default router;
