import { Request, Response } from "express";
import Transaction from "../models/transaction";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";

// Get transactions for a specific user
export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id; // Assuming user ID is available in the request object

  try {
    const transactions = await Transaction.find({ userId }).sort({
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
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
