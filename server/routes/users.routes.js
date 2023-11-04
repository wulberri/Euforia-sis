import { Router } from "express";
import { signup, signin, dashboard, signout, getAllUsers, prueba, updateUsers } from "../controllers/users.js";
import { authorization, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.get("/", prueba);
router.post("/signup", signup);
router.post("/signin", signin);
router.delete("/signout", signout);
router.get("/dashboard/", authorization, dashboard);
router.get("/users", [authorization, isAdmin], getAllUsers)
router.put("/users/update", updateUsers)

export default router;
