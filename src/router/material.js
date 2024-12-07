import { Router } from "express";
import { authenticationSrvice } from "../service/authentication.js";
import { material } from "../controllers/material.js";


const router = Router();

router.post('/',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    material.createMaterial
);
router.delete('/',
    authenticationSrvice.authGuard('specificUserStatus', ['teacher']),
    material.removeMaterial
);

export default router;