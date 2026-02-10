import { getMulter, getRouter } from "../api_utils.js";
import { handleUserReg } from "./auth.controller.js";
import { validateUser } from "./auth.middleware.js";

const router = getRouter();
const file_storage = getMulter();

router.post(
    "/user/signup", 
    validateUser, 
    handleUserReg
);