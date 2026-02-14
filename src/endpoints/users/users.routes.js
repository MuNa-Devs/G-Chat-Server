import { Router } from "express";

import { 
    checkFrndReqParams,
    checkSearchUserParams, 
    checkUserId 
} from "./users.middleware.js";

import { 
    handleTransacFrndReqs,
    handleGetUser, 
    handleSaveDetails, 
    handleSearchUser,
    handleGetFrndReqs,
    handleGetFrnds
} from "./users.controller.js";

import { authorizeToken } from "./../auth/auth.middleware.js";
import { upload } from "../api_utils/file_storage.js";

const user_router = Router();

user_router.get(
    "/get-user", 
    authorizeToken, 
    checkUserId, 
    handleGetUser
);

user_router.post(
    "/save-details", 
    authorizeToken,
    upload.single("pfp"), 
    checkUserId,
    handleSaveDetails
);

user_router.get(
    "/search",
    authorizeToken,
    checkSearchUserParams,
    handleSearchUser
)

user_router.post(
    "/requests",
    authorizeToken,
    checkFrndReqParams,
    handleTransacFrndReqs
)

user_router.get(
    "/requests/sent",
    authorizeToken,
    checkUserId,
    handleGetFrndReqs
)

user_router.get(
    "/friends",
    authorizeToken,
    checkUserId,
    handleGetFrnds
)

export default user_router;