import { Router } from "express";
import { file } from "../controllers/file.js";

const router = Router();

router.get('/stream/:_id', file.getFileStreamById);
router.get('/download/:_id', file.getFileDownloadById);

export default router;