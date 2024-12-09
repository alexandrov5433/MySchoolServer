import { Router } from "express";
import { authenticationService } from "../service/authentication.js";
import { students } from "../controllers/students.js";

const router = Router();

router.get('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    students.getActiveStudents
);

export default router;