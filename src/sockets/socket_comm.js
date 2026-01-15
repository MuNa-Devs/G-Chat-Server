import { Server } from 'socket.io';

import pool from '../db.js';
import { saveDirectMessage, saveRoomMessage } from './socket_logics.js';
import { getUserDetails } from '../endpoints/RouterLogics.js';

export let reusable_io = null;
export const user_socket_map = new Map();

export default function socketSetup(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        socket.join("global");
        let client_id;

        socket.on("register-client", async ({user_id}) => {
            client_id = user_id;
            user_socket_map.set(user_id, socket.id);
        });

        socket.on("join-room", async ({room_id}) => {
            socket.join(room_id);
        });

        socket.on("leave-room", async ({room_id}) => {
            socket.leave(room_id);
        })

        socket.on("send-room-message", async ({user_id, room_id, message}) => {
            const sent_at = new Date();
            saveRoomMessage(user_id, room_id, message, sent_at);

            socket.to(room_id).emit("get-room-message", {
                r_id: room_id,
                user_id: user_id,
                sender_details: await getUserDetails(user_id),
                message: message, 
                sent_at: sent_at
            });
        });

        socket.on("connect-dm", async ({contact_id}) => {
            socket.join(contact_id);
        });

        socket.on("disconnect_id", async ({contact_id}) => {
            socket.leave(contact_id);
        });

        socket.on("send-dm", async ({
            contact_id,
            message,
            sent_by,
            sent_at,
            message_details
        }) => {
            saveDirectMessage(contact_id, message, sent_by, sent_at);
            socket.to(contact_id).emit("get-dm", message_details);
        });

        socket.on("send_message", async ({ user_id, message }) => {
            const userResult = await pool.query(
                "SELECT username FROM users WHERE id = $1",
                [user_id]
            );

            const username = userResult.rows[0].username;
            const date_now = new Date();

            await pool.query(
                "INSERT INTO messages (user_id, message, created_at) VALUES ($1, $2, $3)",
                [user_id, message, date_now]
            );

            io.to("global").emit("receive_message", {
                user_id,
                username,
                message,
                time: date_now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
        });

        socket.on("disconnect", () => {
            user_socket_map.delete(client_id);
        });
    });

    reusable_io = io;

    return io;
}