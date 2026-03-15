import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";

import { 
    handleGetChats,
    handleGetContacts,
    handleGetGlobalChats, 
    handleGetRoomMessages, 
    handleSearchContacts
} from "./messages.controller.js";

import { 
    checkGetChatParams,
    checkGetRoomMsgsParams, 
    checkOffset, 
    checkSearchContactParams
} from "./messages.middleware.js";
import { checkUserId } from "../users/users.middleware.js";

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

msg_router.get(
    "/contacts",
    authorizeToken,
    checkUserId,
    handleGetContacts
);

msg_router.get(
    "/chats",
    authorizeToken,
    checkGetChatParams,
    handleGetChats
);

msg_router.get(
    "/search/contacts",
    authorizeToken,
    checkSearchContactParams,
    handleSearchContacts
);

export default msg_router;