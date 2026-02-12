import { InvalidData } from "../../error_classes/defined_errors.js";

export function checkOffset(req, res, next){
    const offset = Number(req.query.offset);

    if (!offset && offset !== 0){
        throw new InvalidData();
    }

    if (!Number.isInteger(offset) || offset < 0){
        throw new InvalidData();
    }

    req.offset = offset;

    next();
}