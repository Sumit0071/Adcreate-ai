import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import {
  publishAd,
  getPublishedPosts,
  trackAnalyticsEvent,
  getAnalyticsSummary,
} from "../controllers/socialController";

const router: Router = express.Router();

router.route("/publish").post(isAuthenticated, publishAd);
router.route("/posts").get(isAuthenticated, getPublishedPosts);
router.route("/track").post(trackAnalyticsEvent);
router.route("/analytics").get(isAuthenticated, getAnalyticsSummary);

export default router;
