import express from 'express';
import cors from 'cors';
import pool from './db.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());
console.log("k")

const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.join("global");

        socket.on("send_message", async ({ user_id, message }) => {
        const userResult = await pool.query(
            "SELECT username FROM users WHERE id = $1",
            [user_id]
        );

        const username = userResult.rows[0].username;

        await pool.query(
            "INSERT INTO messages (user_id, message) VALUES ($1, $2)",
            [user_id, message]
        );

        io.to("global").emit("receive_message", {
            user_id,
            username,
            message,
            time: new Date()
        });
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.post('/signup', async (req,res)=>{
    try{
    const {username,email,password}= req.body;

    // const result = await pool.query(
    //     "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    //     [username, email, password]

    // );

    console.log(req.body);
    res.json({
        success:true,
        message: "User registered successfully",
        user: "Sarera"
    })
    
}
    catch(err){
        console.error(err.message);

        res.status(500).json({                        
            success: false,
            message: "Internal server error"
        })
    }
}
);

app.post('/signin', async (req,res)=> {
    try {
        // const { email, password } = req.body;

        // const result = await pool.query(
        //     "SELECT * FROM users WHERE email = $1 AND password = $2",
        //     [email, password]
        // );

        // // No user found
        // if (result.rows.length === 0) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid email or password"
        //     });
        // }

        // // More than one user (rare case)
        // if (result.rows.length > 1) {
        //     return res.status(500).json({
        //         success: false,
        //         message: "Duplicate users found — contact admin"
        //     });
        // }
        // console.log(req.body);

        // Exactly 1 user
        return res.json({
            success: true,
            message: "User logged in successfully",
            user: "sarera"
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

server.listen(5500, "0.0.0.0", () => {
    console.log("Backend running on LAN");
});