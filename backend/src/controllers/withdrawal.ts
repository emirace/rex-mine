// src/controllers/withdrawalController.ts

import { Response } from "express";
import Withdrawal from "../models/withdrawal";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";
import Transaction from "../models/transaction";

// Create a withdrawal request
export const createWithdrawalRequest = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?._id;
  const { amount, cryptoAddress } = req.body;

  try {
    // Find the user making the withdrawal
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Create a new withdrawal request
    const newWithdrawal = new Withdrawal({
      userId,
      amount,
      cryptoAddress,
    });

    // Save the withdrawal request to the database
    await newWithdrawal.save();

    // Optionally, deduct the amount from the user's balance
    user.balance -= amount;
    await user.save();

    const transaction = new Transaction({
      amount: amount,
      type: "Withdrawal",
      userId,
    });
    await transaction.save();
    res.status(201).json({
      message: "Withdrawal request created successfully",
      withdrawal: newWithdrawal,
    });
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    res.status(500).json({ message: "Error creating withdrawal request" });
  }
};
