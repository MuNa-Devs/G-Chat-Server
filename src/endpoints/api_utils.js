import { Router } from "express";
import multer from "multer";

export function getRouter() {
    const router = Router();

    router.get('/ping', (req, res) => res.json({ status: true }));

    return router;
}

export function getMulter() {
    const file_storage = multer.diskStorage({
        destination: "./files",
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const file_name = Date.now() + extension;
            cb(null, file_name);
        }
    });

    return file_storage;
}