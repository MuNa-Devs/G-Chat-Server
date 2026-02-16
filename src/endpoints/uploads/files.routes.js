import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";
import { upload } from "../api_utils/file_storage.js";
import { handleFIles } from "./files.controller.js";
import { verifyUploadingUser } from "./files.middleware.js";

const file_router = Router();

file_router.post(
    "/upload",
    authorizeToken,
    verifyUploadingUser,
    upload.array("files"),
    handleFIles
);

export default file_router;