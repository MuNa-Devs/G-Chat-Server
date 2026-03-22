import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";

export async function insertWriter({
    writer_id,
    sample_url,
    price_per_page
}) {
    try {
        const result = await pool.query(
            `
            INSERT INTO writers
            (writer_id, sample_url, price_per_page)
            VALUES ($1,$2,$3)

            RETURNING writer_id;
            `,
            [writer_id, sample_url, price_per_page]
        );

        if (!result.rowCount)
            throw new DatabaseOrServerError();
    }
    catch (err) {
        console.log(err);
        throw new DatabaseOrServerError();
    }
}

export async function fetchAllWriters() {
    // are error handling chei ra...
    // error classes use chei
    try {
        const result = await pool.query(
            `
            SELECT 
                w.writer_id,
                w.sample_url,
                w.price_per_page,
                w.rating,
                u.username,
                u.pfp
            FROM writers w

            JOIN users u
            ON
                w.writer_id = u.id

            ORDER BY w.writer_id

            LIMIT 100;
            `
        );

        return result.rows;
    }
    catch (err){
        console.log(err);
        throw new DatabaseOrServerError();
    }
}