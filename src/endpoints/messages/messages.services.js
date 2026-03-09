import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";
import UMS from "./UMS.js";

export async function getGlobalChats(user_id, last_seen_msg){
    try{
        const res = await pool.query(
            `
            SELECT
                m.*,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'filename', mf.filename,
                            'file_url', mf.file_url
                        ) ORDER BY mf.file_id ASC
                    ) FILTER (WHERE mf.file_id IS NOT NULL),
                    '[]'::json
                ) as files,
                u.username,
                u.pfp
            FROM messages m

            LEFT JOIN message_files mf
            ON
                m.id = mf.id

            JOIN users u
            ON
                m.user_id = u.id

            WHERE m.id < $1

            GROUP BY
                m.id,
                u.id

            ORDER BY m.id ASC

            LIMIT 100;
            `,
            [last_seen_msg]
        );

        return res.rows.map(msg => UMS.globalMessage(msg));
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

export async function getContacts(user_id){
    try{
        const result = await pool.query(
            `
            SELECT
                *
            FROM contacts

            WHERE (
                person1 = $1
                OR
                person2 = $1
            )
            
            ORDER BY contact_id ASC;
            `,
            [user_id]
        );

        return result.rows;
    }
    catch (err){
        console.log("Unexpected DB error for user", user_id);
        throw new DatabaseOrServerError();
    }
}

export async function getChats(user_id, contact_id, last_seen_id){
    try{
        const result = await pool.query(
            `
            SELECT
                dm.*,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'filename', 'dmf.filename',
                            'file_url', 'dmf.file_url'
                        ) ORDER BY dmf.file_id ASC
                    ) FILTER (WHERE dmf.file_id IS NOT NULL)
                    '[]'::json
                ) AS files,
                u.username,
                u.pfp,
                u.id AS user_id
            FROM direct_messages dm

            LEFT JOIN direct_message_files dmf
            ON
                dm.message_id = dmf.message_id

            JOIN users u
            ON
                dm.sent_by = u.id

            WHERE (
                dm.contact_id = $1
                AND
                dm.message_id < $2
            )

            GROUP BY
                dm.message_id,
                u.id

            ORDER BY dm.message_id ASC

            LIMIT 100;
            `,
            [contact_id, last_seen_id]
        );

        const ums = result.rows.map(msg => UMS.directMessage(msg));

        return ums;
    }
    catch (err){
        console.log("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}