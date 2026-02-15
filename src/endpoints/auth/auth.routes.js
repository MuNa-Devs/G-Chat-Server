import { Router } from "express";
import { testMail } from "./auth.controller.js";
import { 
    handleUserLogin, 
    handleUserReg 
} from "./auth.controller.js";

import { 
    validateLoginUser, 
    validateRegUser 
} from "./auth.middleware.js";

console.log("Auth routes loaded");
const auth_router = Router();

auth_router.post("/signup", validateRegUser, handleUserReg);

auth_router.post("/signin", validateLoginUser, handleUserLogin);

auth_router.get("/test-mail", testMail);

export default auth_router;