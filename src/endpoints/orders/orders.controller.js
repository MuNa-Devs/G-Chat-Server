import { insertWriter } from "./orders.query.js";

export async function createWriter(req, res, next) {
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
        next(err);
    }
}