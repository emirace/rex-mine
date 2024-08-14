// src/controllers/withdrawalController.ts

import { Request, Response } from "express";
import Withdrawal from "../models/withdrawal";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";
import Transaction from "../models/transaction";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create a withdrawal request
export const createWithdrawalRequest = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?._id;
  const { amount, cryptoAddress, code } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user making the withdrawal
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the transaction code is correct
    const isMatch = await bcrypt.compare(code, user.transactionCode!);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid transaction code" });
    }

    // Calculate total available for withdrawal (miningBalance + promotionalBalance)
    const totalAvailable = user.miningBalance + user.promotionalBalance;

    // Check if the user has sufficient balance
    if (totalAvailable < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from the user's mining balance first
    let remainingAmount = amount;

    if (user.miningBalance >= remainingAmount) {
      user.miningBalance -= remainingAmount;
      remainingAmount = 0;
    } else {
      remainingAmount -= user.miningBalance;
      user.miningBalance = 0;
    }

    // If there's still an amount left, deduct from the promotional balance
    if (remainingAmount > 0) {
      user.promotionalBalance -= remainingAmount;
      remainingAmount = 0;
    }

    await user.save({ session });

    // Create a new withdrawal request
    const newWithdrawal = new Withdrawal({
      userId,
      amount,
      cryptoAddress,
    });

    // Save the withdrawal request to the database
    await newWithdrawal.save({ session });

    const transaction = new Transaction({
      amount: amount,
      type: "Withdrawal",
      incoming: true,
      userId,
    });
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Withdrawal request created successfully",
      withdrawal: newWithdrawal,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating withdrawal request:", error);
    res.status(500).json({ message: "Error creating withdrawal request" });
  }
};

// Get all withdrawal requests
export const getAllWithdrawalRequests = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("userId", "fullName username")
      .sort({ createdAt: 1 })
      .lean();

    res.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    res.status(500).json({ error: "Error fetching withdrawal requests" });
  }
};

// Update withdrawal request status
export const updateWithdrawalStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    withdrawal.status = status;
    await withdrawal.save();

    res.json({
      message: `Withdrawal request ${status.toLowerCase()} successfully`,
      withdrawal,
    });
  } catch (error) {
    console.error("Error updating withdrawal request status:", error);
    res.status(500).json({ error: "Error updating withdrawal request status" });
  }
};

export const getWithdrawalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    res.json(withdrawal);
  } catch (error) {
    console.error("Error updating withdrawal request status:", error);
    res.status(500).json({ error: "Error updating withdrawal request status" });
  }
};
