import { Router } from "express";
import { checkUserId } from "./users.middleware.js";
import { handleGetUser, handleSaveDetails } from "./users.controller.js";
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
    upload.single("pfp"), 
    authorizeToken,
    checkUserId,
    handleSaveDetails
);

export default user_router;