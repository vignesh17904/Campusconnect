import { Router} from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { signUp,logoutUser,getUser,login,refreshAccessToken,verifyEmail,resendVerificationEmail,getUserById} from "../controllers/user.controller.js";
const router = Router();

router.post("/verify-email", verifyEmail);
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.post("/resend-verification", resendVerificationEmail);
router.get("/get-user", verifyJWT, getUser);
router.get("/:userId", verifyJWT, getUserById);
export default router;