import {
    authorizeUser, 
    registerUser 
} from './auth.services.js';

import jwt from 'jsonwebtoken';

export async function handleUserReg(req, res, next) {
    try{
        const user = await registerUser(req.body);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            success: true,
            token,
            user
        });
    }
    catch (err){ next(err) }
}

export async function handleUserLogin(req, res, next){
    try{
        const user = await authorizeUser(req.body);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            success: true,
            token,
            user
        });
    }
    catch (err){ next(err) }
}