import { Router } from "express";
import { file } from "../controllers/file.js";

const router = Router();

router.get('/:_id', file.getFileStreamById);

export default router;