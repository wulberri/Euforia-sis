import { Router } from "express";

import {
  allResources,
  getUnitSchedule,
  getResourceExpanded,
  getResource,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resources.js";

const router = Router();

router.get("/all-resources", allResources);
router.get("/unit-schedule/:unitNumber", getUnitSchedule);
router.get("/resource/:id", allResources);
router.get("/only-resource/:id", getResourceExpanded);
router.post("/", createResource);
router.get("/:id", getResource);
router.get("/", getResources);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
