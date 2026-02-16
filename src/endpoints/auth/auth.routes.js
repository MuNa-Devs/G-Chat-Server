import { Router } from "express";
import { testMail } from "./auth.controller.js";
import { verifyOtp } from "./auth.controller.js";
import { sendOtp } from "./auth.controller.js";

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

auth_router.get("/test-mail", testMail);

auth_router.post("/verify-otp", verifyOtp);

auth_router.post("/send-otp", sendOtp);// auth_router.post("/refresh-token", refreshToken);

export default auth_router;