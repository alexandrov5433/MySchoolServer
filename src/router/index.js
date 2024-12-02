import { Router } from "express";
// import { authentificationMonitor as monitor } from "../service/userSession.js";
import userRouter from './user.js';
import applicationRouter from './application.js';

const router = Router();

router.use('/user', userRouter);
router.use('/application', applicationRouter);



export default router;