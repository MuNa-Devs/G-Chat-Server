import { 
    ForbiddenAccess, 
    InvalidData 
} from "../../error_classes/defined_errors.js";

import { getUser, saveUserDetails } from "./users.services.js";

export async function handleGetUser(req, res, next){
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

export async function handleSaveDetails(req, res, next){
    const user_id = req.requested_user_id;

    try{
        if (user_id !== req.requesting_user.id)
            throw new ForbiddenAccess();

        req.body.pfp = req.file?.filename || req.body.pfp || null;
        const data = req.body;

        if (!data || data.length < 6)
            throw new InvalidData();

        if (await saveUserDetails(user_id, data)){
            res.status(201).json({
                success: true
            });
        }
    }
    catch (err){
        next(err);
    }
}