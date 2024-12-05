import { Router } from "express";
import { subjects } from "../controllers/subjects.js";
import { authenticationSrvice } from "../service/authentication.js";

const router = Router();

router.post('/create-new-subject', subjects.createNewSubject);
router.get('/',
    authenticationSrvice.authGuard('specificUserStatus', ['student', 'teacher']),
    subjects.getSubjects
);
router.get('/details/:_id',
    authenticationSrvice.authGuard('specificUserStatus', ['student', 'teacher']),
    subjects.getSubjectDetails
);

export default router;