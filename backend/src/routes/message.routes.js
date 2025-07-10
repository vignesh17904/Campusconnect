import express from "express";
import { getMessagesByGroup,sendMessageWithAttachment } from "../controllers/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();

router.get("/:groupId", getMessagesByGroup);
router.post("/send", upload.array("files", 5), sendMessageWithAttachment);
export default router;
