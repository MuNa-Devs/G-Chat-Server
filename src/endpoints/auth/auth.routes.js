import { Router } from "express";
import { 
    handleUserLogin, 
    handleUserReg 
} from "./auth.controller.js";

import { 
    validateLoginUser, 
    validateRegUser 
} from "./auth.middleware.js";

const auth_router = Router();

auth_router.post("/signup", validateRegUser, handleUserReg);

auth_router.post("/signin", validateLoginUser, handleUserLogin);

export default auth_router;