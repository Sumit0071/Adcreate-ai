import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { singleUpload } from "../middleware/multer";
import { registerUser, loginUser, getUserProfile, updateUserProfile,logoutUser } from "../controllers/userController";
import { RegisterSchema, LoginSchema } from "../utils/validate"
import { validateRequest } from "../middleware/validateRequest";
const router: Router = express.Router();
router.route( "/register" ).post( validateRequest( RegisterSchema ), singleUpload as any, registerUser );
router.route( "/login" ).post( validateRequest( LoginSchema ), loginUser );
router.route( "/profile" ).get( authMiddleware, getUserProfile );
router.route( "/update-profile" ).put( authMiddleware, updateUserProfile );
router.route("/logout").post(logoutUser);

export default router;