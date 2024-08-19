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

  // Start a new session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the investment level
    const level = await InvestmentLevel.findById(levelId).session(session);
    if (!level) {
      throw new Error("Investment level not found");
    }

    // Validate the investment amount
    if (amount < level.minAmount || amount > level.maxAmount) {
      throw new Error("Investment amount is out of range");
    }

    // Find the user and populate the invitedBy chain
    const user: any = await User.findById(userId)
      .populate({
        path: "invitedBy",
        select: "invitedBy",
      })
      .session(session);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate total available funds and validate
    const totalAvailable =
      user.balance + user.miningBalance + user.promotionalBalance;

    if (totalAvailable < amount) {
      throw new Error("Insufficient funds");
    }

    // Deduct funds in the order: balance, miningBalance, promotionalBalance
    const balanceDeductions = [
      { key: "balance", amount: user.balance },
      { key: "miningBalance", amount: user.miningBalance },
      { key: "promotionalBalance", amount: user.promotionalBalance },
    ];

    let remainingAmount = amount;
    for (const { key, amount: availableAmount } of balanceDeductions) {
      if (remainingAmount <= 0) break;
      const deduction = Math.min(availableAmount, remainingAmount);
      user[key] -= deduction;
      remainingAmount -= deduction;
    }

    await user.save({ session });

    // Create the transaction record
    await Transaction.create(
      [
        {
          amount,
          type: "Mining",
          incoming: false,
          userId,
          status: "Completed",
        },
      ],
      { session }
    );

    // Handle referral bonuses if applicable
    const referralBonuses = [];
    if (user.invitedBy) {
      referralBonuses.push(
        User.findByIdAndUpdate(
          user.invitedBy._id,
          { $inc: { tempPromotionalBalance: amount * 0.07 } },
          { session }
        ),
        Transaction.create(
          [
            {
              amount: amount * 0.07,
              type: "ReferralBonus",
              referred: user._id,
              incoming: true,
              status: "Completed",
              userId: user.invitedBy._id,
            },
          ],
          { session }
        )
      );

      if (user.invitedBy.invitedBy) {
        referralBonuses.push(
          User.findByIdAndUpdate(
            user.invitedBy.invitedBy,
            { $inc: { tempPromotionalBalance: amount * 0.03 } },
            { session }
          ),
          Transaction.create(
            [
              {
                amount: amount * 0.03,
                type: "ReferralBonus",
                referred: user._id,
                incoming: true,
                status: "Completed",
                userId: user.invitedBy.invitedBy,
              },
            ],
            { session }
          )
        );
      }
    }
    await Promise.all(referralBonuses);

    // Calculate dates for the investment
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + level.validDays);
    const nextPaybackDate = new Date(startDate);
    nextPaybackDate.setDate(nextPaybackDate.getDate() + 1);

    // Create and save the user investment
    const userInvestment = await UserInvestment.create(
      [
        {
          userId,
          investmentLevel: level._id,
          amount,
          startDate,
          endDate,
          nextPaybackDate,
        },
      ],
      { session }
    );

    // Commit the transaction and end the session
    await session.commitTransaction();
    res.status(201).json({
      message: "Investment successful",
      investment: userInvestment,
    });
  } catch (error: any) {
    // Roll back the transaction in case of error
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: error.message || "Error processing investment" });
  } finally {
    session.endSession();
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
      // await User.findByIdAndUpdate(investment.userId, {
      //   $inc: { miningBalance: dailyReturn },
      // });

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

      const transaction = new Transaction({
        amount: dailyReturn,
        type: "Mining",
        incoming: true,
        userId,
        status: "Completed",
      });

      await transaction.save({ session });

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

export const boostUserInvestment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { investmentId, amount } = req.body;

  if (!investmentId || !amount) {
    return res.status(400).json({ error: "Investment Id and amount reqiured" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const investment = await UserInvestment.findOne({
      _id: investmentId,
      userId,
    })
      .populate("investmentLevel")
      .session(session);

    if (!investment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Investment not found" });
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
      type: "Mining",
      incoming: false,
      userId,
      status: "Completed",
    });

    await transaction.save({ session });

    investment.amount += parseFloat(amount);
    await investment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(investment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Error fetching user investment" });
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
      .populate("userId", "username")
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
