// src/routes/investmentRoutes.ts

import express from "express";
import {
  getAllUserInvestments,
  getUserInvestments,
  invest,
} from "../controllers/userInvestment";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth(), getUserInvestments);
router.get("/all", auth("Admin"), getAllUserInvestments);
// Route for user to invest in a plan
router.post("/invest", auth(), invest);

export default router;
