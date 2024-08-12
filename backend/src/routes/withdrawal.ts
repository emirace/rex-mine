// src/routes/withdrawalRoutes.ts

import express from "express";
import {
  createWithdrawalRequest,
  getAllWithdrawalRequests,
  getWithdrawalById,
  updateWithdrawalStatus,
} from "../controllers/withdrawal";
import { auth } from "../middleware/auth";

const router = express.Router();

// Route to create a withdrawal request
router.post("/", auth(), createWithdrawalRequest);
router.get("/", auth("Admin"), getAllWithdrawalRequests);
router.get("/:id", auth("Admin"), getWithdrawalById);
router.patch("/:id", auth("Admin"), updateWithdrawalStatus);

export default router;
