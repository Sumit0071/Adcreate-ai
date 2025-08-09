import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { registerUser,loginUser,getUserProfile,updateUserProfile } from "../controllers/userController";
const router:Router=express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route( "/update-profile" ).put( authMiddleware, updateUserProfile );

export default router;