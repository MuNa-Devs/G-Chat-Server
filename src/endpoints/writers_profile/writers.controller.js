import { insertWriter } from "./writers.query.js";

export async function createWriter(req, res) {
    try {
        const {
            writer_id,
            sample_url,
            price_per_page
        } = req.body;

        await insertWriter({
            writer_id,
            sample_url,
            price_per_page
        });

        res.status(201).json({
            success: true
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
}