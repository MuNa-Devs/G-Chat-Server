import pool from "../../trash/db.js";

export async function saveRoomMessage(uid, rid, msg, time){
    try{
        const db_res = await pool.query(
            `
            INSERT INTO room_messages
            VALUES ($1, $2, $3, $4)
            `,
            [rid, uid, msg, time]
        );

        return true;
    }
    catch (err){
        console.log(err)
        return false;
    }
}

export async function saveDirectMessage(contact_id, message, sent_by, sent_at){
    try{
        const db_res = await pool.query(
            `
            INSERT INTO direct_messages
            (contact_id, message, sent_by, sent_at)
            VALUES ($1, $2, $3, $4)
            `,
            [contact_id, message, sent_by, sent_at]
        );

        return true;
    }
    catch (err){
        console.log(err);
        return false;
    }
}