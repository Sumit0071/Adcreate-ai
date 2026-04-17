import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import { createBusinessProfile, updateBusinessDetails, deleteBusinessProfile, generateAdSequence, getBusinessProfiles, getBusinessProfileById } from "../controllers/businessProfileController";
import { validateRequest } from "../middleware/validateRequest";
import { BusinessProfileSchema } from "../utils/validate";
import { singleUpload } from "../middleware/multer";
const router: Router = express.Router();

router.route("/all").get(isAuthenticated, getBusinessProfiles);
router.route("/:id").get(isAuthenticated, getBusinessProfileById);
router.route( "/create" ).post( isAuthenticated, validateRequest( BusinessProfileSchema ), createBusinessProfile );
router.route( "/:profileId/generate-ads" ).post( isAuthenticated, singleUpload as unknown as import( "express" ).RequestHandler, validateRequest( BusinessProfileSchema ), generateAdSequence );
router.route( "/update/:id" ).put( isAuthenticated, validateRequest( BusinessProfileSchema ), updateBusinessDetails );
router.route("/:id").post(isAuthenticated,deleteBusinessProfile);
export default router;