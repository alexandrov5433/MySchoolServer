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
// router.delete('/:applicationId', );  //teacher REJECTS application
// router.put('/:applicationId', );  //teacher ACCEPTS application

export default router;