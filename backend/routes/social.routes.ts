import express, { Router } from "express";
import isAuthenticated from "../middleware/authMiddleware";
import {
  publishAd,
  getPublishedPosts,
  // trackAnalyticsEvent, // keep commented unless you re-enable/export it
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
// router.route("/track").post(trackAnalyticsEvent); // ENABLE ONLY if exported
router.route("/analytics").get(isAuthenticated, getAnalyticsSummary);

// IMPORTANT: route param name must match controller logic
router.route("/zernio-analytics/:externalPostId").get(isAuthenticated, getZernioPostAnalytics);

export default router;