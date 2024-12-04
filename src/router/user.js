import { Router } from "express";
import { user } from "../controllers/user.js";
import { authenticationSrvice } from "../service/authentication.js";

const router = Router();

router.post('/login', authenticationSrvice.authGuard('guest'), user.login);  //login - parent, teacher, student
router.post('/register', authenticationSrvice.authGuard('guest'), user.register); //register - parent, teacher
router.get('/logout', authenticationSrvice.authGuard('allUsers'), user.logout);

export default router;