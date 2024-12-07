import { Router } from "express";
import { authenticationSrvice } from "../service/authentication.js";
import { assignment } from "../controllers/assignment.js";


const router = Router();

router.post('/',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    assignment.createAssignment
);
router.post('/solution',
    // authenticationSrvice.authGuard('specificUserStatus', ['student']),
    assignment.uploadSolution
);

export default router;