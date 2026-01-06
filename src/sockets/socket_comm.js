import { Server } from 'socket.io';

import pool from '../db.js';

export const user_socket_map = new Map();

export default function socketSetup(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.join("global");
        let client_id;

        socket.on("register-client", async ({user_id}) => {
            client_id = user_id;
            user_socket_map.set(user_id, socket.id);
        })

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
            user_socket_map.delete(client_id);
        });
    });
}