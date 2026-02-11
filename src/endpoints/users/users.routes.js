import { Router } from "express";
import { checkGetUser } from "./users.middleware.js";
import { handleGetUser } from "./users.controller.js";
import { authorizeToken } from "./../auth/auth.middleware.js";

const user_router = Router();

user_router.get("/get-user", authorizeToken, checkGetUser, handleGetUser);

export default user_router;