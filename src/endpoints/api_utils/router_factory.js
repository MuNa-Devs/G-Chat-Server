import { Router } from "express";
import auth_router from "../auth/auth.routes.js";
import user_router from "../users/users.routes.js";
import msg_router from "../messages/messages.router.js";

const router = Router();

router.get("/ping", (req, res) => {
    res.json({ status: true });
});

router.use("/auth", auth_router);
router.use("/users", user_router);
router.use("/messages", msg_router);

export default router;