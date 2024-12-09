import { Router } from "express";
import { authenticationService } from "../service/authentication.js";
import { parent } from "../controllers/parent.js";


const router = Router();

router.get('/:parentId/children',
    authenticationService.authGuard('allUsers'),
    parent.getChildren
);
router.post('/:parentId/children',
    authenticationService.authGuard('allUsers'),
    parent.addChildForParent
);

export default router;