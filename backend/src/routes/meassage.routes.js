import express from "express";
import { getMessagesByGroup } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:groupId", getMessagesByGroup);

export default router;
