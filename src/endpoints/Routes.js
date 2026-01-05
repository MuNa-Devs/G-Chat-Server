import express from 'express';
import multer from 'multer';
import path from "path";

import pool from '../db.js';
import { 
    createRoom, 
    getRoomMembers, 
    getRooms, 
    getUserDetails, 
    isRoomMember, 
    roomMembership, 
    saveUserDetails 
} from './RouterLogics.js';

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

router.get('/users/get-user', async (req, res) => {
    try {
        const user_id = parseInt(req.query.user_id);
        const user_details = await getUserDetails(user_id);

        res.json({
            status: true,
            user_details: user_details
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
})

router.post("/users/save-details", upload.single("pfp"), async (req, res) => {
    try {
        const user_id = Number(req.query.id);
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({ status: false, message: "Invalid user id" });
        }

        const body = req.body;
        const pfp = req.file?.filename || body.pfp || null;

        const data = {
            id: user_id,
            ...body,
            pfp
        };

        const status = await saveUserDetails(data);

        res.json({ status, pfp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false });
    }
});

router.get("/messages", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
            messages.id,
            messages.user_id,
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

router.get("/search-users", async (req, res) => {
    const { query } = req.query;

    const result = await pool.query(
        `
        SELECT id, username
        FROM users
        WHERE username ILIKE $1
        LIMIT 10
        `,
        [`%${query}%`]
    );

    res.json(result.rows);
});

router.post("/rooms/create", upload.single("room_icon"), async (req, res) => {
    const body = req.body;
    const icon = req.file?.filename || null;
    
    const data = {
        ...body,
        room_icon: icon
    }
    
    const r_id = await createRoom(data);
    const status = await roomMembership(r_id, body.room_aid);
    
    res.json({
        status: status,
        room_id: r_id,
        icon_name: data.room_icon
    });
});

router.get("/rooms/is_member", async (req, res) => {
    
    try{
        const r_id = req.query.room_id;
        const u_id = req.query.user_id;

        res.json({
            status: true,
            is_member: await isRoomMember(r_id, u_id)
        });
    }
    catch(err){
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/get-room", async (req, res) => {
    try{
        const room_id = req.query.room_id;

        res.json({
            status: true,
            room_info: await getRooms('a', room_id)
        });
    }
    catch(err){
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/get_my_rooms", async (req, res) => {
    try {
        const uid = req.query.uid;
        const rooms_count = req.query.rooms_count;
        const rooms = await getRooms('my', [parseInt(uid, 10), rooms_count]);

        res.json({
            status: true,
            rooms_info: rooms
        });
    }
    catch (err) {
        console.log(err);

        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/get_all_rooms", async (req, res) => {
    try {
        const rooms_count = req.query.rooms_count;
        const rooms = await getRooms('*', parseInt(rooms_count, 10));

        res.json({
            status: true,
            rooms_info: rooms
        });
    }
    catch (err) {
        console.log(err);

        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/is_member", async (req, res) => {
    try{
        const user_id = req.query.user_id;
        const room_id = req.query.room_id;

        res.json({
            status: true,
            is_member: await isRoomMember(user_id, room_id)
        });
    }
    catch (err){
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/get-members", async (req, res) => {
    try{
        const r_id = parseInt(req.query.room_id);

        res.json({
            status: true,
            members: await getRoomMembers(r_id)
        });
    }
    catch (err){
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
});

router.get("/rooms/join", async (req, res) => {
    try{
        const r_id = req.query.room_id;
        const u_id = req.query.user_id;

        res.json({
            status: true,
            join_status: await roomMembership(r_id, u_id)
        });
    }
    catch (err){
        console.log(err);
        res.json({
            status: false,
            message: err
        });
    }
})

router.post("/add-friend", async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        if (userId === friendId) {
            return res.status(400).json({ message: "Cannot add yourself" });
        }

        await pool.query(
            `INSERT INTO friends (user_id, friend_id)
             VALUES ($1, $2), ($2, $1)
             ON CONFLICT DO NOTHING`,
            [userId, friendId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add friend" });
    }
});

router.get("/friends/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT u.id, u.username
            FROM friends f
            JOIN users u ON u.id = f.friend_id
            WHERE f.user_id = $1
            ORDER BY u.username
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
});

router.post("/send-request", async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId || senderId === receiverId) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        await pool.query(
            `
            INSERT INTO friend_requests (sender_id, receiver_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            `,
            [senderId, receiverId]
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send request" });
    }
});


router.get("/requests/received/:userId", async (req, res) => {
    const { userId } = req.params;

    const result = await pool.query(
        `
        SELECT fr.id, u.id AS sender_id, u.username
        FROM friend_requests fr
        JOIN users u ON u.id = fr.sender_id
        WHERE fr.receiver_id = $1 AND fr.status = 'pending'
        `,
        [userId]
    );

    res.json(result.rows);
});


router.get("/requests/sent/:userId", async (req, res) => {
    const { userId } = req.params;

    const result = await pool.query(
        `
        SELECT fr.id, u.id AS receiver_id, u.username
        FROM friend_requests fr
        JOIN users u ON u.id = fr.receiver_id
        WHERE fr.sender_id = $1
          AND fr.status = 'pending'
        ORDER BY fr.id DESC
        `,
        [userId]
    );

    res.json(result.rows);
});



router.post("/accept-request", async (req, res) => {
    const { requestId, userId } = req.body; // receiver id

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1️⃣ validate request
        const result = await client.query(
            `
            UPDATE friend_requests
            SET status = 'accepted'
            WHERE id = $1
              AND receiver_id = $2
              AND status = 'pending'
            RETURNING sender_id, receiver_id
            `,
            [requestId, userId]
        );

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Invalid request" });
        }

        const { sender_id, receiver_id } = result.rows[0];

        // 2️⃣ insert friends (both directions)
        await client.query(
            `
            INSERT INTO friends (user_id, friend_id)
            VALUES ($1, $2), ($2, $1)
            ON CONFLICT DO NOTHING
            `,
            [sender_id, receiver_id]
        );

        await client.query("COMMIT");

        res.json({ success: true });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Failed to accept request" });
    } finally {
        client.release();
    }
});


router.post("/reject-request", async (req, res) => {
    const { requestId, userId } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE friend_requests
            SET status = 'rejected'
            WHERE id = $1
              AND receiver_id = $2
              AND status = 'pending'
            `,
            [requestId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ message: "Invalid request" });
        }

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reject request" });
    }
});





export default router;