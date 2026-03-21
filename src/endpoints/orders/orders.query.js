import { DatabaseOrServerError } from "../../error_classes/defined_errors.js";
import pool from "../api_utils/db.js";

export async function insertWriter({
    writer_id,
    sample_url,
    price_per_page
}) {
    // just error handling anthe
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
    catch (err){
        console.log(err);
        throw new DatabaseOrServerError();
    }
}