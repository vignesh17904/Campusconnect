import express from "express";
import { verifyJWT} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import {
  getAllUsers,
  deleteUser,
  getAllGroups,
  deleteGroup,
  getAllQuestions,
  deleteQuestion,
  deleteAnswer,
  searchUsers,
  searchGroups,
  searchQuestions
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyJWT, isAdmin);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/groups", getAllGroups);
router.delete("/groups/:id", deleteGroup);

router.get("/questions", getAllQuestions);
router.delete("/questions/:id", deleteQuestion);

router.delete("/answers/:id", deleteAnswer);
router.get("/search/users", searchUsers);
router.get("/search/groups", searchGroups);
router.get("/search/questions", searchQuestions);


export default router;
