import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { singleUpload } from "../middleware/multer";
import { registerUser,loginUser,getUserProfile,updateUserProfile } from "../controllers/userController";
const router:Router=express.Router();
router.route("/register").post(singleUpload as any,registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route( "/update-profile" ).put( authMiddleware, updateUserProfile );

export default router;