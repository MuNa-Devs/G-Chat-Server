import {
    authorizeUser, 
    registerUser 
} from './auth.services.js';

import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

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

export const testMail = async (req, res) => {
    try {

        console.log("EMAIL:", process.env.EMAIL);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "Test Mail",
            text: "Mail is working!"
        });

        res.json({ message: "Mail sent successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Mail failed" });
    }
};
