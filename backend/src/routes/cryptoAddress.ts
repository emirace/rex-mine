// src/routes/investmentRoutes.ts

import express from "express";
import { auth } from "../middleware/auth";
import { coinpaymentIpn, getCryptoAddress } from "../controllers/cryptoAddress";

const router = express.Router();

router.get("/address", auth(), getCryptoAddress);
router.post("/callback", coinpaymentIpn);

export default router;
