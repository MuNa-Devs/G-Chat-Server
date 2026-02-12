import { getGlobalChats } from "./messages.services.js";

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