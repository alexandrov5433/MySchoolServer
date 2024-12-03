import { Router } from "express";
import { user } from "../controllers/user.js";

const router = Router();

router.post('/login', user.login);  //login - parent, teacher, student
router.post('/register', user.register); //register - rapent, teacher

export default router;