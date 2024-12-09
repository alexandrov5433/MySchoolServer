import { Router } from "express";
import { subjects } from "../controllers/subjects.js";
import { authenticationService } from "../service/authentication.js";

const router = Router();

router.post('/create-new-subject',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    subjects.createNewSubject
);

router.get('/',
    authenticationService.authGuard('specificUserStatus', ['student', 'teacher']),
    subjects.getSubjects
);
router.get('/details/:_id',
    authenticationService.authGuard('specificUserStatus', ['student', 'teacher']),
    subjects.getSubjectDetails
);
router.post('/participants/manage',
    authenticationService.authGuard('specificUserStatus', ['student', 'teacher']),
    subjects.maganeParticipation
);

export default router;