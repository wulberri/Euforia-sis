import { Router } from "express";
import { reserveResource, prueba, activeReserves } from '../controllers/reserve.js'
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.get("/", [authorization], prueba);
router.post("/reserve", [authorization], reserveResource);
router.post('/active-reserves', [authorization, isAdmin], activeReserves)

export default router;
