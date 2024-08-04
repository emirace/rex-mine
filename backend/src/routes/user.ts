import express from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
  loginUser,
  registerUser,
  getUser,
  createTransactionCode,
  getUserHourlyReturnRate,
  claimPromotionBalance,
  addReferrer,
} from "../controllers/user";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth("Admin"), getUsers);
router.get("/getUser", auth(), getUser);
router.get("/hourly", auth(), getUserHourlyReturnRate);
router.get("/:id", auth("Admin"), getUserById);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/create-transaction-code", auth(), createTransactionCode);
router.post("/claim-promotion", auth(), claimPromotionBalance);
router.post("/add-referrer", auth(), addReferrer);
router.put("/:id", auth("Admin"), updateUser);
router.delete("/:id", auth("Admin"), deleteUser);

export default router;
