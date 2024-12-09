import { Router } from "express";
import { authenticationService } from "../service/authentication.js";
import { announcement } from "../controllers/announcement.js";

const router = Router();

router.post('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    announcement.publishAnnouncement
);
router.delete('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    announcement.deleteAnnouncement
);

export default router;