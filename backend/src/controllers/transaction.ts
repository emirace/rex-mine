import { Request, Response } from "express";
import Transaction from "../models/transaction";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";

// Get transactions for a specific user
export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id; // Assuming user ID is available in the request object

  try {
    // Adding a filter to get transactions with amount greater than 0.0001
    const transactions = await Transaction.find({
      userId,
      amount: { $gt: 0.0001 }, // Ensure amount is greater than 0.0001
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

// Get all transactions (admin only)
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Adding a filter to get transactions with amount greater than 0.0001
    const transactions = await Transaction.find({
      amount: { $gt: 0.0001 }, // Ensure amount is greater than 0.0001
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
