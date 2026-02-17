import { isRoomMember } from "../../sockets/room_socket/room_chat.services.js";
import { 
    createRoom, 
    getRoomMembers, 
    getRooms, 
    getSearchedRooms, 
    joinRoom, 
    leaveRoom 
} from "./rooms.services.js";

export async function checkMembership(req, res, next){
    try{
        res.status(201).json({
            success: true,
            is_member: await isRoomMember(req.room_id, req.user_id)
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetMyRooms(req, res, next){
    const user_id = req.user_id;
    const last_seen_id = req.last_seen_id;

    try{
        const rooms = await getRooms("my", user_id, last_seen_id, 0);

        res.status(201).json({
            success: true,
            rooms
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetAllRooms(req, res, next){
    const user_id = req.user_id;
    const last_seen_id = req.last_seen_id;

    try{
        const rooms = await getRooms("*", user_id, last_seen_id, 0);

        res.status(201).json({
            success: true,
            rooms
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetARoom(req, res, next){
    const user_id = req.user_id;
    const room_id = req.room_id;

    try{
        const room_info_rows = await getRooms('a', user_id, 0, room_id);

        res.status(201).json({
            success: true,
            room_info: room_info_rows[0]
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetRoomMembers(req, res, next){
    const user_id = req.user_id;
    const room_id = req.room_id;

    try{
        const members = await getRoomMembers(room_id, user_id);

        res.status(201).json({
            success: true,
            members
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleSearchRooms(req, res, next){
    const user_id = req.user_id;
    const last_seen_id = req.last_seen_id
    const search_query = req.search_query;

    try{
        const rooms = await getSearchedRooms(search_query.toLowerCase(), last_seen_id, user_id);

        res.status(201).json({
            success: true,
            rooms
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleModifyRooms(req, res, next){
    const user_id = req.user_id;
    const data = req.data;

    try{
        const room_id = await createRoom(user_id, data);

        res.status(201).json({
            success: true,
            room_id,
            icon_name: data.room_icon
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleJoinRoom(req, res, next){
    const user_id = req.user_id;
    const room_id = req.room_id;

    try{
        const is_room_member = await isRoomMember(room_id, user_id);

        if (is_room_member)
            return res.status(201).json({ success: true });
        
        await joinRoom(room_id, user_id);

        res.status(201).json({ success: true });
    }
    catch (err){
        next(err);
    }
}

export async function handleLeaveRoom(req, res, next){
    const user_id = req.user_id;
    const room_id = req.room_id;

    try{
        const is_room_member = await isRoomMember(room_id, user_id);

        if (is_room_member)
            await leaveRoom(room_id, user_id);

        res.status(201).json({ success: true });
    }
    catch (err){
        next(err);
    }
}