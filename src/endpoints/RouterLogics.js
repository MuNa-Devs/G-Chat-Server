import pool from "../db.js";

export async function getUserDetails(data){
    try{
        const db_res = await pool.query(
            `
            SELECT 
                users.id, 
                users.username, 
                users.email, 
                users.is_verified, 
                users.pfp, 
                users.department,
                users.about,
                users.phone,
                users.personal_email
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
            pfp: "#",
            department: '',
            about: '',
            phone: '',
            personal_email: ''
        }
    }
}

export async function saveUserDetails(data){
    try{
        const db_res = await pool.query(
            `
            UPDATE users
            SET username = $1,
                pfp = $2,
                department = $3,
                about = $4,
                phone = $5,
                personal_email = $6
            WHERE id = $7
            `,
            [
                data.username, 
                data.pfp, 
                data.department, 
                data.about, 
                data.phone, 
                data.email,
                data.id
            ]
        )

        return true;
    }
    catch (err){
        console.log(err);
        return false;
    }
}

export async function createRoom(data) {
    try {
        const db_res = await pool.query(
            `
                INSERT INTO rooms
                (r_name, r_desc, r_aid, r_size, popl_size, r_type, join_pref, icon_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `,
            [
                data.room_name,
                data.room_desc,
                data.room_aid,
                data.room_size,
                0,
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
        const popl_size = await pool.query(
            `
            UPDATE rooms
            SET popl_size = popl_size + 1
            WHERE r_id = $1
            `,
            [r_id]
        );

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

        case 'a':
            const db_res3 = await pool.query(
                `
                SELECT rooms.*, users.username AS admin_name, users.*
                FROM rooms
                JOIN users ON rooms.r_aid = users.id
                WHERE rooms.r_id = $1
                `,
                [vals]
            );

            return db_res3.rows[0];
    }
}

export async function isRoomMember(room_id, user_id){
    const db_res = await pool.query(
        `
        SELECT room_members.r_id
        FROM room_members
        WHERE room_members.r_id = $1 AND room_members.user_id = $2
        `,
        [room_id, user_id]
    );

    return ! db_res.rowCount == 0;
}

export async function getRoomMembers(room_id){
    const db_res = await pool.query(
        `
        SELECT DISTINCT users.*
        FROM room_members
        JOIN users ON room_members.user_id = users.id
        WHERE room_members.r_id = $1
        `,
        [room_id]
    );

    console.log(db_res.rows);

    return db_res.rows
}