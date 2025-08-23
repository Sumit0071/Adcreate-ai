import express, { Router } from "express";
import { googleAuth } from "../controllers/googleAuthController";

const router: Router = express.Router();

// POST /auth/google
router.post("/google", googleAuth);

export default router;
