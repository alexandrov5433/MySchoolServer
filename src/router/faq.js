import { Router } from "express";
import { faq } from "../controllers/faq.js";


const router = Router();

router.get('/', faq.getAllFaqData);
router.post('/', faq.createNewFaqEntry);
router.delete('/:_id', faq.deleteFaqEntry);

export default router;