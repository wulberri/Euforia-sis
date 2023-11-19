import { Router } from "express";
import { reserveResource, prueba } from '../controllers/reserve.js'
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.get("/", [authorization], prueba);
router.post("/reserve", [authorization], reserveResource);

export default router;
