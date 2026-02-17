import { Server } from 'socket.io';
import jwt from "jsonwebtoken";
import { saveDirectMessage } from '../../trash/socket_logics.js';
import { InvalidJWT, UnAuthorized } from '../error_classes/defined_errors.js';
import { getUser } from '../endpoints/users/users.services.js';
import { globalChat } from './global_socket/global_chat.socket.js';
import { roomChat } from './room_socket/room_chat.socket.js';

export const user_socket_map = new Map();

export default function socketSetup(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new UnAuthorized());
        }

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = user;
            next();
        }
        catch (err) {
            next(new InvalidJWT());
        }
    });

    io.on("connection", async (socket) => {

        try {
            socket.user_details = await getUser(socket.user.id);
        }
        catch (err) {
            socket.emit("socket_error", { code: "FORBIDDEN_ACCESS" });
        }

        globalChat(io, socket);
        roomChat(io, socket);

        socket.on("connect-dm", async ({ contact_id }) => {
            socket.join(contact_id);
        });

        socket.on("disconnect_id", async ({ contact_id }) => {
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

        socket.on("disconnect", () => {
            user_socket_map.delete(socket.user.id);
        });
    });

    return io;
}