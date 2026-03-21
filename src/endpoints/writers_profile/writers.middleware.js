export function validateWriter(req, res, next) {
    const {
        writer_id,
        sample_url,
        price_per_page
    } = req.body;

    if (!writer_id || !sample_url || !price_per_page) {
        return res.status(400).json({
            success: false
        });
    }

    next();
}