import { Router } from "express";
import { authenticationSrvice } from "../service/authentication.js";
import { announcement } from "../controllers/announcement.js";

const router = Router();

router.post('/',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    announcement.publishAnnouncement
);

export default router;