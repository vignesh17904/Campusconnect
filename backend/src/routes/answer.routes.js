import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { postAnswer,voteAnswer } from "../controllers/answer.controller.js";



const router = Router();

router.post("/:questionId", verifyJWT, postAnswer);
router.post("/vote/:answerId", verifyJWT, voteAnswer);

export default router;