import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import { addBusinessDetails, updateBusinessDetails } from "../controllers/businessProfileController";
import { validateRequest } from "../middleware/validateRequest";
import { BusinessProfileSchema } from "../utils/validate";
const router: Router = express.Router();

router.route( "/add-business-details" ).post( isAuthenticated, validateRequest(BusinessProfileSchema), addBusinessDetails );
router.route( "/update-business-details" ).put( isAuthenticated, validateRequest(BusinessProfileSchema), updateBusinessDetails );
export default router;