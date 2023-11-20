import { Router } from "express";
import { reserveResource, prueba, activeReserves, historyReserves } from '../controllers/reserve.js'
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.get("/", [authorization], prueba);
router.post("/reserve", [authorization], reserveResource);
router.post('/active-reserves', [authorization, isAdmin], activeReserves) // Para administradores
router.post('/history-reserves', [authorization], historyReserves) // Para usuarios

export default router;
