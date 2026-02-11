import { Router } from "express";
import auth_router from "../auth/auth.routes.js";
import user_router from "../users/users.routes.js";

const router = Router();

router.get("/ping", (req, res) => {
    res.json({ status: true });
});

router.use("/auth", auth_router);
router.use("/users", user_router);

export default router;