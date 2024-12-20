import { Router } from "express";
import { authenticationService } from "../service/authentication.js";
import { material } from "../controllers/material.js";


const router = Router();

router.post('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    material.createMaterial
);
router.delete('/',
    authenticationService.authGuard('specificUserStatus', ['teacher']),
    material.removeMaterial
);

export default router;