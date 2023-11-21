import { Router } from "express";
import {
  allResources,
  getResourceExpanded,
  getResource,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resources.js";

const router = Router();

router.get("/all-resources", allResources);
router.get("/resource/:id", allResources);
router.post("/", createResource);
router.get("/:id", getResource);
router.get("/", getResources);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
