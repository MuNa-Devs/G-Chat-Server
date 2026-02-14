import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";

import { 
    checkGetRoomParams, 
    checkModifyRoomParams, 
    checkSearchRoomParams 
} from "./rooms.middleware.js";

import { 
    handleGetAllRooms, 
    handleGetMyRooms, 
    handleModifyRooms, 
    handleSearchRooms
} from "./rooms.controller.js";

import { upload } from "../api_utils/file_storage.js";

const rooms_router = Router();

rooms_router.get(
    "/my-rooms", 
    authorizeToken, 
    checkGetRoomParams,
    handleGetMyRooms
);

rooms_router.get(
    "/all-rooms",
    authorizeToken,
    checkGetRoomParams,
    handleGetAllRooms
);

rooms_router.get(
    "/get-room",
    authorizeToken,
    //
)

rooms_router.get(
    "/search",
    authorizeToken,
    checkSearchRoomParams,
    handleSearchRooms
);

rooms_router.post(
    "/create",
    authorizeToken,
    upload.single("room_icon"),
    checkModifyRoomParams,
    handleModifyRooms
);

export default rooms_router;