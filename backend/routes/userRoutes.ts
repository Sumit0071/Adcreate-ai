import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { singleUpload } from "../middleware/multer";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/userController";
import { UserSchema } from "../utils/validate"
import { validateRequest } from "../middleware/validateRequest";
const router:Router=express.Router();
router.route("/register").post(validateRequest(UserSchema),singleUpload as any,registerUser);
router.route("/login").post(validateRequest(UserSchema),loginUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route( "/update-profile" ).put( authMiddleware, updateUserProfile );

export default router;