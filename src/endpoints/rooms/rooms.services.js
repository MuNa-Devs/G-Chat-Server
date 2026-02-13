import { 
    DatabaseOrServerError 
} from "../../error_classes/defined_errors.js";

import pool from "../../../trash/db.js";

export async function getRooms(constraint, user_id, last_seen_id, room_id) {
    let result;

    try {
        switch (constraint) {
            case '*':
                result = await pool.query(
                `
                SELECT
                    r.*,
                    COUNT(rm.user_id) AS popl_size,
                    u.username,
                    EXISTS(
                        SELECT 
                            rm.r_id
                        FROM room_members rm

                        WHERE rm.user_id = $1
                    ) AS is_member
                FROM rooms r

                JOIN users u
                ON 
                    r.r_aid = u.id

                LEFT JOIN room_members rm
                ON
                    r.r_id = rm.r_id

                WHERE
                    r.r_type = 'public'
                    AND
                    r.r_id > $2

                GROUP BY r.r_id, u.username

                ORDER BY r.r_id DESC

                LIMIT 20
                `,
                    [user_id, last_seen_id]
                );

                break;

            case 'my':
                result = await pool.query(
                `
                SELECT
                    r.*,
                    COUNT(rm.user_id),
                    u.username
                FROM rooms r

                JOIN users u
                ON 
                    r.r_aid = u.id

                LEFT JOIN room_members rm
                ON
                    r.r_id = rm.r_id

                WHERE 
                    r.r_aid = $1 
                    OR 
                    rm.user_id = $1
                    AND
                    r.r_id > $2

                GROUP BY r.r_id, u.username

                ORDER BY r.r_id DESC

                LIMIT 20
                `,
                    [user_id, last_seen_id]
                );

                break;

            case 'a':
                result = await pool.query(
                `
                SELECT
                    r.*,
                    COUNT(rm.user_id) AS popl_size,
                    u.username AS admin_name,
                    u.*
                FROM rooms r

                JOIN users u
                ON 
                    r.r_aid = u.id

                LEFT JOIN room_members rm
                ON
                    r.r_id = rm.r_id

                WHERE r.r_id = $1

                GROUP BY r.r_id, u.id;
                `,
                    [room_id]
                );

                break;
        }
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        DatabaseOrServerError();
    }

    return result.rows;
}

export async function getSearchedRooms(search_query, last_seen_id, user_id){
    try{
        const search_string = `${search_query}%`;

        const result = await pool.query(
            `
            SELECT
                r.*,
                COUNT(rm.r_id) AS popl_size,
                u.username
            FROM rooms r

            JOIN users u
            ON 
                r.r_aid = u.id

            LEFT JOIN room_members rm
            ON
                r.r_id = rm.r_id

            WHERE
                r.r_name ILIKE $1
                OR
                u.username ILIKE $1
                AND
                r.r_id > $2

            GROUP BY r.r_id, u.username

            LIMIT 20;
            `,
            [search_string, last_seen_id]
        );

        return result.rows;
    }
    catch (err){
        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}

export async function createRoom(user_id, data){
    const db_instance = await pool.connect();

    try{
        db_instance.query('BEGIN');

        const room_res = await db_instance.query(
            `
            INSERT INTO rooms
                (r_name, r_desc, r_aid, r_size, r_type, join_pref, icon_url)
            
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)

            RETURNING r_id;
            `,
            [
                data.room_name,
                data.room_desc,
                user_id,
                data.room_size,
                data.room_type,
                data.join_pref,
                data.room_icon
            ]
        );

        const room_id = room_res.rows[0].r_id;

        await db_instance.query(
            `
            INSERT INTO room_members
                (r_id, user_id)

            VALUES
                ($1, $2)
            `,
            [room_id, user_id]
        );

        await db_instance.query('COMMIT');

        return room_id;
    }
    catch (err){
        db_instance.query('ROLLBACK');

        console.error("Unexpected DB error for user", user_id, err);
        throw new DatabaseOrServerError();
    }
}