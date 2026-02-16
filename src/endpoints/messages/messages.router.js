import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";

import { 
    handleGetGlobalChats, 
    handleGetRoomMessages 
} from "./messages.controller.js";

import { 
    checkGetRoomMsgsParams, 
    checkOffset 
} from "./messages.middleware.js";

const msg_router = Router();

msg_router.get(
    "/global", 
    authorizeToken, 
    checkOffset, 
    handleGetGlobalChats
);

msg_router.get(
    "/room", 
    authorizeToken, 
    checkGetRoomMsgsParams, 
    handleGetRoomMessages
);

export default msg_router;