import { Router } from "express";
import { application } from "../controllers/application.js";

const router = Router();

// router.get('/:applicationId', );  //teacher application review
router.post('/', application.apply); //apply now (register) - applicant (student)
// router.delete('/:applicationId', );  //teacher REJECTS application
// router.put('/:applicationId', );  //teacher ACCEPTS application

export default router;