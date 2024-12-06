import { Router } from "express";
import { application } from "../controllers/application.js";
import { authenticationSrvice } from "../service/authentication.js";

const router = Router();

router.get('/single-pending-application/:_id', 
    authenticationSrvice.authGuard('specificUserStatus', 'teacher'),
    application.getPendingApplicationById
);  //teacher application review
router.get('/pending',
    authenticationSrvice.authGuard('specificUserStatus', 'teacher'),
    application.getPendingApplications
);  //teacher application review
router.post('/', authenticationSrvice.authGuard('guest'), application.apply); //apply now (register) - applicant (student)
router.post('/manage',
    authenticationSrvice.authGuard('specificUserStatus', 'teacher'),
    application.manageApplication
);
//teacher REJECTS application
//teacher ACCEPTS application

export default router;