import {
    authorizeUser, 
    registerUser 
} from './auth.services.js';

import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import { verifyOtpService } from "./auth.services.js";
import crypto from "crypto";
import pool from '../api_utils/db.js';
import { RegistrationFailed } from '../../error_classes/defined_errors.js';
import { transporter } from '../api_utils/mailer.js';

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


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    return res.status(200).json({
      message: result.message,
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
    try {
        console.log("Request body:", req.body);  // <-- add this line
        console.log("Request query:", req.query);  // <-- add this line

        const { email } = req.body;

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999);

        // Set expiry: 5 minutes from now
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        const status = await storeOtp(otp, expiry, email) ? true : false;

        if (!status) {
            throw new RegistrationFailed();
        }

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for G-Chat",
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
        });

        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};
