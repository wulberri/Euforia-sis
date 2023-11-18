import { Router } from "express";
import { startLoan, endLoan } from "../controllers/loan.js"
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.post("/start-loan", [authorization, isAdmin], startLoan);
router.post("/end-loan", [authorization, isAdmin], endLoan);

export default router;