import pool from "../db.js";

export function saveMessage(uid, rid, msg, time){
    try{
        const db_res = pool.query(
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