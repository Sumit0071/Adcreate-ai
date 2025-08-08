import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const router:Router=express.Router();
router.route("/register").post()