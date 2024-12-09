import { Router } from "express";
import { profile } from "../controllers/profile.js";
import { authenticationSrvice } from "../service/authentication.js";


const router = Router();

router.get('/user',
    authenticationSrvice.authGuard('allUsers'),
    profile.getUserData
);
router.get('/user/:_id/documents',
    authenticationSrvice.authGuard('allUsers'),
    profile.getUserDocuments
);
router.post('/user/:_id/documents',
    authenticationSrvice.authGuard('allUsers'),
    profile.uploadDocument
);
router.delete('/user/:_id/documents/:fileId',
    authenticationSrvice.authGuard('allUsers'),
    profile.deleteDocument
);

router.get('/user/:_id/grading',
    authenticationSrvice.authGuard('allUsers'),
    profile.getUserGradings
);
router.post('/user/:_id/grading',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    profile.addGradeForUserInGrading
);
router.put('/user/:_id/grading',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    profile.editGrade
);
router.delete('/user/:_id/grading/:gradingId/:gradeId',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    profile.dleteGrade
);

export default router;