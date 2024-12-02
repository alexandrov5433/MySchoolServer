import { Router } from "express";
import { user } from "../controllers/user.js";

const router = Router();

router.get('/', user.login);  //login - parent, teacher, student
router.post('/', user.register); //register - rapent, teacher

export default router;