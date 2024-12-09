import { Router } from "express";
import { profile } from "../controllers/profile.js";
import { authenticationService } from "../service/authentication.js";


const router = Router();

router.get('/user',
    authenticationService.authGuard('allUsers'),
    profile.getUserData
);
router.get('/user/:_id/documents',
    authenticationService.authGuard('allUsers'),
    profile.getUserDocuments
);
router.post('/user/:_id/documents',
    authenticationService.authGuard('allUsers'),
    profile.uploadDocument
);
router.delete('/user/:_id/documents/:fileId',
    authenticationService.authGuard('allUsers'),
    profile.deleteDocument
);

router.get('/user/:_id/grading',
    authenticationService.authGuard('allUsers'),
    profile.getUserGradings
);
router.post('/user/:_id/grading',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    profile.addGradeForUserInGrading
);
router.put('/user/:_id/grading',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    profile.editGrade
);
router.delete('/user/:_id/grading/:gradingId/:gradeId',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    profile.dleteGrade
);

export default router;