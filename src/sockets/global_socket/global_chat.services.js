import pool from "../../endpoints/api_utils/db.js";
import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";


export async function saveGlobalMsg(user_id, message){
    try{
        const result = await pool.query(
            `
            INSERT INTO messages
                (user_id, message)

            VALUES
                ($1, $2)

            RETURNING created_at;
            `,
            [user_id, message]
        );

        if (!result.rowCount)
            throw new DatabaseOrServerError();

        return result.rows[0].created_at;
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}