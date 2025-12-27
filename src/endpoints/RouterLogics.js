import pool from "../db.js";

export async function getUserDetails(data){
    try{
        const db_res = await pool.query(
            `
            SELECT users.id, users.username, users.email, users.is_verified, users.pfp
            FROM users
            WHERE users.id = $1
            `,
            [data]
        )

        return db_res.rows[0];
    }
    catch (err){
        console.log(err);
        return {
            id: 0,
            username: '',
            email: '',
            is_verified: '',
            pfp: "#"
        }
    }
}

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

export async function getRooms(constraint, vals){

    switch (constraint){
        case '*':
            const db_res1 = await pool.query(
                `
                SELECT rooms.*, users.username
                FROM rooms
                JOIN users ON rooms.r_aid = users.id
                ORDER BY rooms.r_id DESC
                LIMIT 20 OFFSET $1
                `,
                [vals]
            );
            
            return db_res1.rows;

        case 'my':
            const db_res2 = await pool.query(
                `
                SELECT DISTINCT rooms.*, users.username
                FROM rooms
                JOIN users ON rooms.r_aid = users.id
                LEFT JOIN room_members ON rooms.r_id = room_members.r_id
                WHERE rooms.r_aid = $1 OR room_members.user_id = $1
                ORDER BY rooms.r_id DESC
                LIMIT 20 OFFSET $2
                `,
                [vals[0], vals[1]]
            );

            return db_res2.rows;
    }
}