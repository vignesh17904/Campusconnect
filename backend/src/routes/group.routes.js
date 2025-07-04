import express from "express";
import { createGroup } from "../controllers/group.controller.js";
import { verifyJWT} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createGroup);

export default router;
