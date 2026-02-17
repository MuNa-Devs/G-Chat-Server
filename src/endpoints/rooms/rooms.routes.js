import { Router } from "express";
import { authorizeToken } from "../auth/auth.middleware.js";

import { 
    checkGetARoomParams,
    checkGetRoomParams, 
    checkModifyRoomParams, 
    checkSearchRoomParams 
} from "./rooms.middleware.js";

import { 
    checkMembership,
    handleGetAllRooms, 
    handleGetARoom, 
    handleGetMyRooms, 
    handleGetRoomMembers, 
    handleJoinRoom, 
    handleLeaveRoom, 
    handleModifyRooms, 
    handleSearchRooms
} from "./rooms.controller.js";

import { upload } from "../api_utils/file_storage.js";

const rooms_router = Router();

rooms_router.get(
    "/is_member",
    authorizeToken,
    checkGetARoomParams,
    checkMembership
);

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
    checkGetARoomParams,
    handleGetARoom
);

rooms_router.get(
    "/members",
    authorizeToken,
    checkGetARoomParams,
    handleGetRoomMembers
);

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

rooms_router.get(
    "/join",
    authorizeToken,
    checkGetARoomParams,
    handleJoinRoom
);

rooms_router.get(
    "/leave",
    authorizeToken,
    checkGetARoomParams,
    handleLeaveRoom
);

export default rooms_router;