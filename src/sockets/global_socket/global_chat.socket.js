import { saveGlobalMsg } from "./global_chat.services.js";

export function globalChat(io, socket) {
    socket.join("global");

    socket.on("send_message", async ({ message }) => {
        const ver_user_id = socket.user_details.id;
        const username = socket.user_details.username;

        try {
            const time = await saveGlobalMsg(ver_user_id, message);

            socket.broadcast.to("global").emit("receive_message", {
                user_id: ver_user_id,
                username,
                message,
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
        }
        catch (err) {
            socket.emit("socket_error", { code: (err.code || "DATABASE_ERROR") });
        }
    });
}