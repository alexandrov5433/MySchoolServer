import { Router } from "express";
import { subjects } from "../controllers/subjects.js";

const router = Router();

router.post('/create-new-subject', subjects.createNewSubject);

export default router;