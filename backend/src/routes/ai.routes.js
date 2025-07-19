import express from "express";
import { writeCommunityPost } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/write-post", writeCommunityPost);

export default router;
