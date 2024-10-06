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
    if (amount < 4) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Enter a valid amount" });
    }

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

    // Check if the user has created a withdrawal in the past 24 hours
    const lastWithdrawal = await Withdrawal.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (lastWithdrawal) {
      const now = new Date();
      const lastRequestTime = new Date(lastWithdrawal.createdAt);
      const hoursSinceLastRequest =
        (now.getTime() - lastRequestTime.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastRequest < 24) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message:
            "You can only create a withdrawal request once every 24 hours.",
        });
      }
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

    const transaction = new Transaction({
      amount: amount,
      type: "Withdrawal",
      incoming: false,
      userId,
    });
    const newTransaction = await transaction.save({ session });

    // Create a new withdrawal request
    const newWithdrawal = new Withdrawal({
      userId,
      transactionId: newTransaction._id,
      amount,
      cryptoAddress,
    });

    // Save the withdrawal request to the database
    await newWithdrawal.save({ session });

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    const withdrawal = await Withdrawal.findById(id).session(session);
    if (!withdrawal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    const transaction = await Transaction.findById(
      withdrawal.transactionId
    ).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = await User.findById(withdrawal.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Update transaction status
    transaction.status = status === "Approved" ? "Completed" : "Failed";
    await transaction.save({ session });

    // If withdrawal is rejected, credit the user back
    if (status === "Rejected") {
      user.balance = withdrawal.amount;
      // Save User
      await user.save({ session });
    }

    // Update withdrawal status
    withdrawal.status = status;
    await withdrawal.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Withdrawal request ${status.toLowerCase()} successfully`,
      withdrawal,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
