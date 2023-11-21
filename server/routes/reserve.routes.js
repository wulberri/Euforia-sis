import { Router } from "express";
import { reserveResource, prueba, activeReserves, historyReserves, deleteReserve } from '../controllers/reserve.js'
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.get("/", [authorization], prueba);
router.post("/reserve", [authorization], reserveResource);
router.post('/active-reserves', [authorization, isAdmin], activeReserves) // Para administradores -> reservas sin iniciar su prestamo
router.post('/history-reserves', [authorization], historyReserves) // Para usuarios
router.delete('/reserve/:id', [authorization], deleteReserve)

export default router;
