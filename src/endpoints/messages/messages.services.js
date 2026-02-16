import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";
import UMS from "./UMS.js";

export async function getGlobalChats(user_id, offset){
    try{
        const res = await pool.query(
            `
            SELECT
                m.*,
                u.id,
                u.username,
                u.pfp
            FROM messages m

            JOIN users u
            ON
                m.user_id = u.id

            ORDER BY m.id ASC
            
            LIMIT 100 OFFSET $1;
            `,
            [offset]
        );

        return res.rows;
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}

export async function getRoomMessages(user_id, room_id, last_seen){
    try{
        const result = await pool.query(
            `
            SELECT
                rm.*,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'filename', rmf.filename,
                            'file_url', rmf.file_url,
                            'mime_type', rmf.mime_type
                        ) ORDER BY rmf.file_id ASC
                    ) FILTER (WHERE rmf.file_id IS NOT NULL),
                    '[]'::json
                ) AS files,
                u.username,
                u.pfp
            FROM room_messages rm

            LEFT JOIN room_message_files rmf
            ON
                rm.message_id = rmf.message_id
            
            JOIN users u
            ON
                rm.user_id = u.id

            WHERE (
                rm.r_id = $1
                AND
                rm.message_id < $2
            )

            GROUP BY
                rm.message_id,
                u.id

            ORDER BY rm.message_id ASC

            LIMIT 100;
            `,
            [room_id, last_seen]
        );

        const ums = result.rows.map(msg => UMS.roomMessage(msg));

        return ums;
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}