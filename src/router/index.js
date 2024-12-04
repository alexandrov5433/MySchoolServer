import { Router } from "express";
import userRouter from './user.js';
import applicationRouter from './application.js';
import subjectsRouter from './subjects.js';

const router = Router();

router.use('/user', userRouter);
router.use('/application', applicationRouter);
router.use('/subjects', subjectsRouter);

export default router;