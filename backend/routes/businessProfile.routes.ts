import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import { addBusinessDetails,updateBusinessDetails } from "../controllers/businessProfileController";
const router: Router = express.Router();

router.route( "/add-business-details" ).post( isAuthenticated, addBusinessDetails );
router.route( "/update-business-details" ).put( isAuthenticated, updateBusinessDetails );
export default router;