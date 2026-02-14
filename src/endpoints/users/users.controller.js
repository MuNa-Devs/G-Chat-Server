import { 
    ForbiddenAccess, 
    InvalidData 
} from "../../error_classes/defined_errors.js";

import { 
    acceptFrndReq, 
    getFriends, 
    getSentFrndReqs, 
    getUser, 
    saveUserDetails, 
    searchUsers, 
    sendFrndReq 
} from "./users.services.js";

export async function handleGetUser(req, res, next){
    const user_id = Number(req.requested_user_id);
    const req_user_id = Number(req.query.req_user_id);

    try{
        const user = await getUser(req_user_id);

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
    const user_id = Number(req.requested_user_id);

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

export async function handleSearchUser(req, res, next){
    const user_id = Number(req.user_id);
    const search_query = req.search_query;

    try{
        const users = await searchUsers(user_id, search_query);

        res.status(201).json({
            success: true,
            users
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleTransacFrndReqs(req, res, next){
    const user_id = Number(req.user_id);
    const data = req.data;
    const action = req.action;

    try{
        let response;

        switch (action){
            case "send":
                response = await sendFrndReq(data.senderId, data.receiverId);
                
                break;

            case "accept":
                response = await acceptFrndReq(data.requestId, data.userId);

                break;

            case "reject":
                //

                break;
        }

        res.status(201).json({
            success: true,
            response
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetFrndReqs(req, res, next){
    const user_id = Number(req.user_id);

    try{
        const sent_reqs = await getSentFrndReqs(user_id);

        res.status(201).json({
            success: true,
            sent_reqs
        });
    }
    catch (err){
        next(err);
    }
}

export async function handleGetFrnds(req, res, next){
    const user_id = req.user_id;

    try{
        const friends = await getFriends(user_id);
    }
    catch (err){
        next(err);
    }
}