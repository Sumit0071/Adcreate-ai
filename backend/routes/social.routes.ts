import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import {
  publishAd,
  getPublishedPosts,
  trackAnalyticsEvent,
  getAnalyticsSummary,
  getConnectUrl,
  getConnectedAccounts,
  createZernioProfile,
  getZernioPostAnalytics,
} from "../controllers/socialController";

const router: Router = express.Router();

// ── Zernio account management ─────────────────────────────────────────────
router.route("/profiles").post(isAuthenticated, createZernioProfile);
router.route("/connect-url").get(isAuthenticated, getConnectUrl);
router.route("/accounts").get(isAuthenticated, getConnectedAccounts);

// ── Publishing & scheduling ───────────────────────────────────────────────
router.route("/publish").post(isAuthenticated, publishAd);
router.route("/posts").get(isAuthenticated, getPublishedPosts);

// ── Analytics ─────────────────────────────────────────────────────────────
router.route("/track").post(trackAnalyticsEvent);
router.route("/analytics").get(isAuthenticated, getAnalyticsSummary);
router.route("/zernio-analytics/:postId").get(isAuthenticated, getZernioPostAnalytics);

export default router;
