import { Request, Response } from "express";
import InvestmentLevel from "../models/investmentLevel";
import UserInvestment from "../models/userInvestment";
import User from "../models/user";
import { AuthRequest } from "../middleware/auth";
import Transaction from "../models/transaction";
import mongoose from "mongoose";

// User invests in a plan
export const invest = async (req: AuthRequest, res: Response) => {
  const { levelId, amount } = req.body;
  const userId = req.user?._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the investment level
    const level = await InvestmentLevel.findById(levelId).session(session);
    if (!level) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Investment level not found" });
    }

    // Check if the amount is within the valid range
    if (amount < level.minAmount || amount > level.maxAmount) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Investment amount is out of range" });
    }

    // Find the user
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Check total available funds
    const totalAvailable =
      user.balance + user.miningBalance + user.promotionalBalance;

    if (totalAvailable < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct from the user's balance first
    let remainingAmount = amount;

    if (user.balance >= remainingAmount) {
      user.balance -= remainingAmount;
      remainingAmount = 0;
    } else {
      remainingAmount -= user.balance;
      user.balance = 0;
    }

    // If there's still an amount left, deduct from the mining balance
    if (remainingAmount > 0) {
      if (user.miningBalance >= remainingAmount) {
        user.miningBalance -= remainingAmount;
        remainingAmount = 0;
      } else {
        remainingAmount -= user.miningBalance;
        user.miningBalance = 0;
      }
    }

    // If there's still an amount left, deduct from the promotional balance
    if (remainingAmount > 0) {
      user.promotionalBalance -= remainingAmount;
      remainingAmount = 0;
    }

    await user.save({ session });

    const transaction = new Transaction({
      amount: amount,
      type: "Deposit",
      userId,
      status: "Completed",
    });

    await transaction.save({ session });

    // Calculate start date, end date, and next payback date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + level.validDays); // Set the end date
    const nextPaybackDate = new Date(startDate);
    nextPaybackDate.setDate(nextPaybackDate.getDate() + 1);

    // Create a new user investment
    const userInvestment = new UserInvestment({
      userId,
      investmentLevel: level._id,
      amount,
      startDate,
      endDate, // Save the end date
      nextPaybackDate,
    });

    await userInvestment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "Investment successful", investment: userInvestment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Error processing investment" });
  }
};

// Calculate returns and update balances
export const processInvestments = async () => {
  try {
    const today = new Date();

    // Find all investments with due paybacks that haven't expired
    const investments = await UserInvestment.find({
      nextPaybackDate: { $lte: today },
      isClaimable: false,
      endDate: { $gte: today }, // Ensure the investment is still valid
    }).populate("investmentLevel");

    for (const investment of investments) {
      const level = investment.investmentLevel as any;

      // Calculate daily return
      const dailyReturn = (investment.amount * level.percentage) / 100;

      // Update user's mining balance
      await User.findByIdAndUpdate(investment.userId, {
        $inc: { miningBalance: dailyReturn },
      });

      // Update next payback date

      investment.isClaimable = true;
      const res = await investment.save();
    }
  } catch (error) {
    console.error("Error processing investments:", error);
  }
};

export const claimInvestment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    // Fetch investment and validate ownership and claimable status in one query
    const investment = await UserInvestment.findOne({
      _id: id,
      userId,
      isClaimable: true,
    }).populate("investmentLevel");

    if (!investment) {
      return res
        .status(404)
        .json({ message: "Investment not found or not claimable" });
    }

    // Use a transaction for atomic operations on investment and user documents
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const level = investment.investmentLevel as any;
      const dailyReturn = (investment.amount * level.percentage) / 100;

      // Update user's mining balance
      await User.findByIdAndUpdate(
        userId,
        { $inc: { miningBalance: dailyReturn } },
        { session }
      );

      // Update investment status
      investment.isClaimable = false;
      const nextPaybackDate = new Date();
      nextPaybackDate.setDate(nextPaybackDate.getDate() + 1);
      investment.nextPaybackDate = nextPaybackDate;
      const resp = await investment.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json(resp);
    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error claiming investment:", error);
    res.status(500).json({ error: "Unable to claim investment" });
  }
};

// Get all investments for a user sorted by nextPaybackDate
export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  try {
    // Find investments for the user and sort by nextPaybackDate
    const investments = await UserInvestment.find({ userId })
      .populate("investmentLevel")
      .sort({ nextPaybackDate: 1 }); // Sort by ascending nextPaybackDate

    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user investments" });
  }
};

export const getAllUserInvestments = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const {
      search,
      minAmount,
      maxAmount,
      sortField = "nextPaybackDate",
      sortOrder = "asc",
      page = 1,
      limit = 20,
    } = req.query;

    // Build query filters
    const filters: any = {};

    if (search) {
      // Search by user name or investment level name
      const users = await User.find({
        name: new RegExp(search as string, "i"),
      }).select("_id");
      const userIds = users.map((user) => user._id);
      filters.userId = { $in: userIds };
    }

    if (minAmount) {
      filters.amount = { ...filters.amount, $gte: Number(minAmount) };
    }

    if (maxAmount) {
      filters.amount = { ...filters.amount, $lte: Number(maxAmount) };
    }

    // Calculate pagination parameters
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch investments with filters, sorting, and pagination
    const investments = await UserInvestment.find(filters)
      .populate("userId", "name")
      .populate("investmentLevel", "name")
      .sort({ [sortField as string]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(pageSize);

    // Get total count for pagination
    const totalCount = await UserInvestment.countDocuments(filters);

    res.status(200).json({
      investments,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching investments" });
  }
};
