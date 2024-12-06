import { Router } from "express";
import userRouter from './user.js';
import applicationRouter from './application.js';
import subjectsRouter from './subjects.js';
import fileRouter from './file.js';
import announcementRouter from './announcement.js';

const router = Router();

router.use('/user', userRouter);
router.use('/application', applicationRouter);
router.use('/subjects', subjectsRouter);
router.use('/file', fileRouter);
router.use('/announcement', announcementRouter);

export default router;