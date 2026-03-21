import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";
import { createWriter } from "./writers.controller.js";
const writer_router = Router();

writer_router.post(
    "/create",
    authorizeToken,
    createWriter
);

export default writer_router;