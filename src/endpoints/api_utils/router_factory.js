import { Router } from "express";
import auth_router from "../auth/auth.routes.js" ;
import user_router from "../users/users.routes.js";
import msg_router from "../messages/messages.router.js";
import rooms_router from "../rooms/rooms.routes.js";
import file_router from "../uploads/files.routes.js";
import writer_router from "../writers_profile/writers.routes.js";
const router = Router();

router.get("/ping", (req, res) => {
    res.json({ status: true });
});

router.use("/auth", auth_router);
router.use("/users", user_router);
router.use("/messages", msg_router);
router.use("/rooms", rooms_router);
router.use("/files", file_router);
router.use("/writers", writer_router);

export default router;