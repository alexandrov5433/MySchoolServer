import { Router } from "express";
import userRouter from './user.js';
import applicationRouter from './application.js';
import subjectsRouter from './subjects.js';
import fileRouter from './file.js';
import announcementRouter from './announcement.js';
import assignmentRouter from './assignment.js';
import materialRouter from './material.js';

const router = Router();

router.use('/user', userRouter);
router.use('/application', applicationRouter);
router.use('/subjects', subjectsRouter);
router.use('/file', fileRouter);
router.use('/announcement', announcementRouter);
router.use('/assignment', assignmentRouter);
router.use('/material', materialRouter);


router.use('*', (req, res) => {
    res.status(404);
    res.json(JSON.stringify({
        status: 404,
        msg: 'Path not found.'
    }));
    res.end();
});

export default router;