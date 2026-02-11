import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";

export async function getUser(user_id){
    try{
        const result = await pool.query(
            `
            SELECT
                u.id, 
                u.username, 
                u.email, 
                u.is_verified, 
                u.pfp, 
                u.department,
                u.about,
                u.phone,
                u.personal_email
            FROM users u
            WHERE u.id = $1;
            `,
            [user_id]
        );

        return result.rows[0];
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}