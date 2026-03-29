import { Router } from "express";
import { verifyOtp } from "./auth.controller.js";
import { sendOtp } from "./auth.controller.js";

import { 
    handleUserLogin, 
    handleUserReg 
} from "./auth.controller.js";

import { 
    authorizeToken,
    validateLoginUser, 
    validateRegUser 
} from "./auth.middleware.js";

const auth_router = Router();

auth_router.post("/signup", validateRegUser, handleUserReg);

auth_router.post("/signin", validateLoginUser, handleUserLogin);

auth_router.post("/verify-otp", authorizeToken, verifyOtp);

auth_router.post("/send-otp", authorizeToken, sendOtp);

export default auth_router;