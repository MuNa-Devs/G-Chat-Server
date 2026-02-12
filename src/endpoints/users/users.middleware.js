import { 
    InvalidData, 
    MissingData 
} from "../../error_classes/defined_errors.js";

export function checkUserId(req, res, next){
    const user_id = Number(req.query.user_id);

    if (!user_id)
        throw new MissingData();

    if (!Number.isInteger(user_id) || user_id < 1)
        throw new InvalidData();

    req.requested_user_id = user_id; // user to fetch

    next();
}