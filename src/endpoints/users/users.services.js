import {
    DatabaseOrServerError,
    InvalidUser
} from "../../error_classes/defined_errors.js";

import pool from "../api_utils/db.js";

export async function getUser(user_id) {
    try {
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
    catch (err) {
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}

export async function saveUserDetails(id, data) {
    try {
        const result = await pool.query(
            `
            UPDATE users
            SET
                pfp = $1,
                username = $2,
                department = $3,
                about = $4,
                phone = $5,
                personal_email = $6

            WHERE id = $7

            RETURNING id;
            `,
            [
                data.pfp || null,
                data.username || null,
                data.department || null,
                data.about || null,
                data.phone === "" ? null : data.phone,
                data.email || null,
                id
            ]
        );

        if (result.rowCount === 0)
            throw new InvalidUser();

        return true;
    }
    catch (err) {

        if (err.is_expected)
            throw err;

        console.error("Unexpected DB error for user", id, err);
        throw new DatabaseOrServerError();
    }
}