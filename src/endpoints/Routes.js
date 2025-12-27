import express from 'express';

import pool from '../db.js';

const router = express.Router();

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



export default router;