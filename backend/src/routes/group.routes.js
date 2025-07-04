import express from "express";
import { createGroup,getAllUserCreatedGroups,sendJoinRequest,handleJoinRequest} from "../controllers/group.controller.js";
import { verifyJWT} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createGroup);
router.get("/all-user-groups", verifyJWT, getAllUserCreatedGroups);
router.post("/send-join-request", verifyJWT, sendJoinRequest);
router.post("/handle-request", verifyJWT, handleJoinRequest);

export default router;
