import { 
    getGlobalChats, 
    getRoomMessages 
} from "./messages.services.js";

export async function handleGetGlobalChats(req, res, next){
    const user_id = req.requesting_user.id;
    const offset = req.offset;

    try{
        const chats = await getGlobalChats(user_id, offset);
        
        res.status(201).json({
            success: true,
            chats
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetRoomMessages(req, res, next){
    const user_id = req.user_id;
    const room_id = req.room_id;
    const last_seen = req.last_seen;

    try{
        const messages = await getRoomMessages(user_id, room_id, last_seen);

        res.status(201).json({
            success: true,
            messages
        });
    }
    catch (err){
        next(err);
    }
}