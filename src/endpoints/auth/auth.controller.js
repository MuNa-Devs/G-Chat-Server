import {
    authorizeUser, 
    registerUser 
} from './auth.services.js';

export async function handleUserReg(req, res, next) {
    try{
        const user = await registerUser(req.body);

        res.status(201).json({
            success: true,
            user
        });
    }
    catch (err){ next(err) }
}

export async function handleUserLogin(req, res, next){
    try{
        const user = await authorizeUser(req.body);

        res.status(201).json({
            success: true,
            user
        });
    }
    catch (err){ next(err) }
}