import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";

import { 
    createWriter,
    getAllWriters
} from "./orders.controller.js";

import {
    validateCre_writerMemo
} from "./orders.middleware.js";
import { checkUserId } from "../users/users.middleware.js";

const orders_router = Router();

orders_router.post(
    "/writer/create",
    authorizeToken,
    validateCre_writerMemo,
    createWriter
);

orders_router.get(
    "/writer/all",
    authorizeToken,
    checkUserId,
    getAllWriters
);

export default orders_router;