// src/routes/withdrawalRoutes.ts

import express from "express";
import { createWithdrawalRequest } from "../controllers/withdrawal";
import { auth } from "../middleware/auth";

const router = express.Router();

// Route to create a withdrawal request
router.post("/", auth(), createWithdrawalRequest);

export default router;
