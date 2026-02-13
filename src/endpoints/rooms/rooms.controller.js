import { createRoom, getRooms, getSearchedRooms } from "./rooms.services.js";

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