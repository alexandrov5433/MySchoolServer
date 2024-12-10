import { Router } from "express";
import { form } from "../controllers/form.js";


const router = Router();

router.get('/', form.getFormsData);
router.post('/', form.createNewForm);
router.delete('/:_id', form.deleteForm);

export default router;