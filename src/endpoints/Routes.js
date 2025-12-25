import express from 'express';
import multer from 'multer';
import path from "path";

import pool from '../db.js';
import { createRoom, roomMembership } from './RouterLogics.js';

const router = express.Router();

const file_storage = multer.diskStorage({
    destination: "./files",
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const file_name = Date.now() + extension;
        cb(null, file_name);
    }
});

const upload = multer({ storage: file_storage });

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password]

        );

        console.log(req.body);
        res.json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        })

    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            [email, password]
        );

        // No user found
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // More than one user (rare case)
        if (result.rows.length > 1) {
            return res.status(500).json({
                success: false,
                message: "Duplicate users found — contact admin"
            });
        }
        console.log(req.body);

        // Exactly 1 user
        return res.json({
            success: true,
            message: "User logged in successfully",
            user: result.rows[0]
        });

    }
    catch (err) {
        console.error(err.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get("/messages", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
            messages.id,
            messages.message,
            messages.created_at,
            users.username
            FROM messages
            JOIN users ON users.id = messages.user_id
            ORDER BY messages.created_at;
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.post("/rooms/create", upload.single("room_icon"), async (req, res) => {
    console.log("hi");
    const body = req.body;
    const icon = req.file ? req.file : null;

    const data = {
        ...body,
        room_icon: icon.filename
    }

    const r_id = await createRoom(data);
    const status = await roomMembership(r_id, body.room_aid);
    
    res.json({
        status: status,
        room_id: r_id,
        icon_name: data.room_icon
    });
});

export default router;