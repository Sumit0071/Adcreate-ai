import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import { updateBusinessDetails,generateAdsecquenceController  } from "../controllers/businessProfileController";
import { validateRequest } from "../middleware/validateRequest";
import { BusinessProfileSchema } from "../utils/validate";
import { singleUpload } from "../middleware/multer";
const router: Router = express.Router();

router.route( "/generateAd" ).post( isAuthenticated,singleUpload as unknown as import("express").RequestHandler, validateRequest(BusinessProfileSchema), generateAdsecquenceController );
router.route( "/update-business-details" ).put( isAuthenticated, validateRequest(BusinessProfileSchema), updateBusinessDetails );
export default router;