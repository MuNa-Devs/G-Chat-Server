import pool from "../db.js";

export async function createRoom(data) {
    try {
        const db_res = await pool.query(
            `
                INSERT INTO rooms
                (r_name, r_desc, r_aid, r_size, r_type, join_pref, icon_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `,
            [
                data.room_name,
                data.room_desc,
                data.room_aid,
                data.room_size,
                data.room_type,
                data.join_pref,
                data.room_icon
            ]
        );

        return db_res.rows[0].r_id;
    }
    catch (err) {
        console.log(err);

        return 0;
    }
}

export async function roomMembership(r_id, user_id) {
    try {
        const db_res = await pool.query(
            `
            INSERT INTO room_members
            (r_id, user_id)
            VALUES ($1, $2)
            RETURNING *
            `,
            [r_id, user_id]
        );

        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}