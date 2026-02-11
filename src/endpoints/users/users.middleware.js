import { 
    InvalidData, 
    MissingData 
} from "../../error_classes/defined_errors.js";

export function checkGetUser(req, res, next){
    const user_id = Number(req.query.user_id);

    if (!user_id)
        throw new MissingData();

    if (!Number.isInteger(user_id) || user_id < 1){
        console.log(user_id);
        throw new InvalidData();
    }

    req.requested_user_id = user_id; // user to fetch

    next();
}