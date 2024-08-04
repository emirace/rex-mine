// src/routes/transactionRoutes.ts

import express from "express";
import {
  getUserTransactions,
  getAllTransactions,
} from "../controllers/transaction";
import { auth } from "../middleware/auth";

const router = express.Router();

// Route to get transactions for the logged-in user
router.get("/", auth(), getUserTransactions);

// Route to get all transactions (admin only)
router.get("/all", auth("Admin"), getAllTransactions);

export default router;
