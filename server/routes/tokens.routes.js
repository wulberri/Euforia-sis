import { Router } from "express";
import { createNewAccessToken, getUserInfo } from "../controllers/tokens.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();

router.post("/", createNewAccessToken);
router.get("/user", authorization, getUserInfo);

export default router;
