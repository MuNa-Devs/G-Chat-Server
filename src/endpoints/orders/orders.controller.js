import { insertWriter } from "./orders.query.js";
import { fetchAllWriters } from "./orders.query.js";


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

export async function getAllWriters(req, res, next) {
    try {
        const writers = await fetchAllWriters();

        res.status(200).json({
            success: true,
            writers
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}