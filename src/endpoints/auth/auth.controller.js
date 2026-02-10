import { registerUser } from './auth.services';

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