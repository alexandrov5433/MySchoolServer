import { Router } from "express";
import { user } from "../controllers/user.js";
import { authenticationService } from "../service/authentication.js";

const router = Router();

router.post('/login', authenticationService.authGuard('guest'), user.login);  //login - parent, teacher, student
router.post('/register', authenticationService.authGuard('guest'), user.register); //register - parent, teacher
router.get('/logout', authenticationService.authGuard('allUsers'), user.logout);

export default router;