import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";
import { createWriter } from "./orders.controller.js";
import {
    validateCre_writerMemo
} from "./orders.middleware.js";

const orders_router = Router();

orders_router.post(
    "/writer/create",
    authorizeToken,
    validateCre_writerMemo,
    createWriter
);

export default orders_router;