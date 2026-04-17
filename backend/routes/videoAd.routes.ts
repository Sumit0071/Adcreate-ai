import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import { getAvatarOptions, generateVideoAd } from "../controllers/videoAdController";

const router: Router = express.Router();

router.route("/avatars").get(getAvatarOptions);
router.route("/:profileId/generate-video").post(isAuthenticated, generateVideoAd);

export default router;
