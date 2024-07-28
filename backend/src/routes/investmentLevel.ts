import express from "express";
import {
  createInvestmentLevel,
  getInvestmentLevels,
  getInvestmentLevel,
  updateInvestmentLevel,
  deleteInvestmentLevel,
} from "../controllers/investmentLevel";
import { auth } from "../middleware/auth";

const router = express.Router();

// Create a new investment level (only accessible by admins)
router.post("/", auth(), createInvestmentLevel);

// Get all investment levels
router.get("/", getInvestmentLevels);

// Get a specific investment level
router.get("/:id", auth("Admin"), getInvestmentLevel);

// Update an investment level (only accessible by admins)
router.put("/:id", auth("Admin"), updateInvestmentLevel);

// Delete an investment level (only accessible by admins)
router.delete("/:id", auth("Admin"), deleteInvestmentLevel);

export default router;
