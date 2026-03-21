import pool from "../../endpoints/api_utils/db.js";

export async function insertWriter({
    writer_id,
    sample_url,
    price_per_page
}) {
    await pool.query(
        `
        INSERT INTO writers
        (writer_id, sample_url, price_per_page)
        VALUES ($1,$2,$3)
        `,
        [writer_id, sample_url, price_per_page]
    );
}