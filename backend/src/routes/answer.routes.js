import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { postAnswer } from "../controllers/answer.controller.js";


const router = Router();

router.post("/:questionId", verifyJWT, postAnswer);

export default router;