// src/routes/userRoutes.ts

import express from "express";
import user from "./user";
import userInvestment from "./userInvestment";
import investmentLevel from "./investmentLevel";
import cryptoAddress from "./cryptoAddress";
import withdrawal from "./withdrawal";
import transaction from "./transaction";

const router = express.Router();

router.use("/users", user);
router.use("/investments", userInvestment);
router.use("/investment-levels", investmentLevel);
router.use("/crypto", cryptoAddress);
router.use("/withdrawals", withdrawal);
router.use("/transactions", transaction);

export default router;
