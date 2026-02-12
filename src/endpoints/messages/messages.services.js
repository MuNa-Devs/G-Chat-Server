import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";

export async function getGlobalChats(user_id, offset){
    try{
        const res = await pool.query(
            `
            SELECT
                m.*,
                u.id,
                u.username
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