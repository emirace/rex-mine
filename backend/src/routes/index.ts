// src/routes/userRoutes.ts

import express from "express";
import user from "./user";
import userInvestment from "./userInvestment";
import investmentLevel from "./investmentLevel";
const router = express.Router();

router.use("/users", user);
router.use("/investments", userInvestment);
router.use("/investment-levels", investmentLevel);

export default router;
