import { getUser } from "./users.services.js";

export async function handleGetUser(req, res){
    const user_id = req.requested_user_id;

    try{
        const user = await getUser(user_id);

        res.status(201).json({
            success: true,
            user
        });
    }
    catch (err){
        next(err);
    }
}