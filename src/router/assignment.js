import { Router } from "express";
import { authenticationService } from "../service/authentication.js";
import { assignment } from "../controllers/assignment.js";


const router = Router();

router.post('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    assignment.createAssignment
);
router.post('/solution',
    authenticationService.authGuard('specificUserStatus', ['student']),
    assignment.uploadSolution
);
router.delete('/:assignmentId',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    assignment.deleteAssignment
);


export default router;