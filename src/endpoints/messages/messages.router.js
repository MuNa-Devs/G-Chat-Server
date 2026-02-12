import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";
import { handleGetGlobalChats } from "./messages.controller.js";
import { checkOffset } from "./messages.middleware.js";

const msg_router = Router();

msg_router.get("/global", authorizeToken, checkOffset, handleGetGlobalChats);

export default msg_router;