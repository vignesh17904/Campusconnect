import { Router } from "express";
import { askQuestion,getAllQuestions,getQuestionById } from "../controllers/question.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/ask", verifyJWT, askQuestion);
router.get("/all",verifyJWT, getAllQuestions)
router.get("/:questionId", verifyJWT, getQuestionById);

export default router;
