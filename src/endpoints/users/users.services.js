import {
    DatabaseOrServerError,
    ForbiddenAccess,
    FrndReqTransactionFailed,
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

export async function searchUsers(user_id, search_query) {
    try {
        const search_string = `${search_query}%`;

        // Complete this query tomorrow. Good morning BTW
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                pfp,
                EXISTS (
                    SELECT friend_id
                    FROM friends

                    WHERE 
                ) AS is_friend
            FROM users

            WHERE
                username ILIKE $1
                AND
                NOT id = $2

            LIMIT 15

            ORDER BY username ASC;
            `,
            [search_string, user_id]
        );

        return result.rows;
    }
    catch (err) {
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}

export async function sendFrndReq(sender, receiver) {
    const db_instance = await pool.connect();

    try {
        await db_instance.query('BEGIN');

        const frnd_res = await db_instance.query(
            `
            WITH request_id AS (
                DELETE FROM friend_requests fr
                
                WHERE (
                    sender_id = $2
                    AND
                    receiver_id = $1
                )

                RETURNING request_id
            )

            INSERT INTO friends
                (user1, user2)

            SELECT LEAST($1, $2), GREATEST($1, $2)

            WHERE (
                EXISTS (SELECT request_id FROM request_id)
                AND
                NOT EXISTS (
                    SELECT f.friend_id
                    FROM friends f

                    WHERE (
                        user1 = LEAST($1, $2)
                        AND
                        user2 = GREATEST($1, $2)
                    )
                )
            )

            RETURNING friend_id;
            `,
            [sender, receiver]
        );

        if (frnd_res.rowCount){
            await db_instance.query('COMMIT');
            throw new FrndReqTransactionFailed();
        }

        const result = await db_instance.query(
            `
            INSERT INTO friend_requests

            SELECT $1, $2

            WHERE NOT EXISTS (
                SELECT fr.request_id
                FROM friend_requests fr

                WHERE (
                    fr.sender_id = $1
                    AND
                    fr.receiver_id = $2
                )
            )

            RETURNING request_id;
            `,
            [sender, receiver]
        );

        if (!result.rows[0].request_id)
            throw new FrndReqTransactionFailed();

        await db_instance.query('COMMIT');

        return result.rows[0].request_id;
    }
    catch (err) {
        if (err.is_expected)
            throw err;

        await db_instance.query('ROLLBACK');

        console.error("Unexpected DB error for user", sender, err);
        throw new DatabaseOrServerError();
    }
    finally{
        db_instance.release();
    }
}

export async function acceptFrndReq(request_id, user_id) {
    const db_instance = await pool.connect();

    try {
        await db_instance.query('BEGIN');

        const result = await db_instance.query(
            `
            DELETE
            FROM friend_requests

            WHERE (
                request_id = $1
                AND
                NOT receiver_id = $2
            )

            RETURNING
                sender_id,
                receiver_id;
            `,
            [request_id, user_id]
        );

        const user1 = result.rows[0]?.receiver_id;
        const user2 = result.rows[0]?.sender_id;

        if (!user1 || !user2)
            throw new FrndReqTransactionFailed();

        if (user1 !== user_id)
            throw new ForbiddenAccess();

        const friend_result = await db_instance.query(
            `
            INSERT INTO friends
                (user1, user2)

            VALUES
                (LEAST($1, $2), GREATEST($1, $2))
            
            RETURNING friend_id;
            `,
            [user1, user2]
        );

        if (!friend_result.rows[0].friend_id)
            throw new FrndReqTransactionFailed();

        await db_instance.query('COMMIT');
    }
    catch (err) {
        await db_instance.query('ROLLBACK');

        if (err.is_expected)
            throw err;

        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
    finally{
        db_instance.release();
    }
}

export async function rejectFrndReq() {
    //
}

export async function getSentFrndReqs(user_id) {
    try {
        const result = await pool.query(
            `
            SELECT
                request_id,
                sender_id AS user_id,
                receiver_id,
                sent_at
            FROM friend_requests

            WHERE sender_id = $1

            LIMIT 15

            ORDER BY request_id DESC;
            `,
            [user_id]
        );

        return result.rows;
    }
    catch (err) {
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}

export async function getFriends(user_id) {
    try {
        const result = await pool.query(
            `
            SELECT
            `
        )
    }
    catch (err) {
        console.error("Unexpected DB error for user", user_id, err);
    }
}