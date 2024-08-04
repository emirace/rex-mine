// src/controllers/userController.ts

import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthRequest } from "../middleware/auth";
import UserInvestment from "../models/userInvestment";
import mongoose from "mongoose";

// Secret key for JWT (normally you'd use an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const generateReferralCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Generate a 6-character alphanumeric code
};

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, username, password, invitationCode } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique referral code
    const referralCode = generateReferralCode();

    // Create a new user object
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      referralCode,
    });

    // Handle invitation code if provided
    if (invitationCode) {
      // Find the user with the invitation code
      const invitingUser = await User.findOne({ referralCode: invitationCode });
      if (invitingUser) {
        newUser.invitedBy = invitingUser._id as mongoose.Schema.Types.ObjectId;
      } else {
        return res.status(400).json({ message: "Invalid invitation code" });
      }
    }

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", referralCode });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const createTransactionCode = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?._id; // Assuming the user ID is available in the request object
  const { transactionCode } = req.body;
  try {
    // Hash the transaction code for security
    const salt = await bcrypt.genSalt(10);
    const hashedTransactionCode = await bcrypt.hash(transactionCode, salt);

    // Update the user's transaction code in the database
    await User.findByIdAndUpdate(userId, {
      transactionCode: hashedTransactionCode,
      hasTransactionCode: true,
    });

    res.status(200).json({
      message: "Transaction code created successfully",
    });
  } catch (error) {
    console.error("Error creating transaction code:", error);
    res.status(500).json({ error: "Error creating transaction code" });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Get user
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;
    const newUser = new User({ name, username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, username, password },
      { new: true }
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Error updating user" });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const getUserHourlyReturnRate = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?._id; // Assume userId is set by auth middleware
  console.log("here");
  try {
    // Find all active investments for the user
    const investments: any = await UserInvestment.find({
      userId,
      nextPaybackDate: { $gte: new Date() },
      endDate: { $gte: new Date() },
    }).populate("investmentLevel");

    if (investments.length === 0) {
      return res.status(200).json({ hourlyReturnRate: 0 });
    }
    let totalHourlyReturnRate = 0;

    investments.forEach(
      (investment: {
        amount: number;
        investmentLevel: { percentage: number };
      }) => {
        const dailyReturnRate =
          (investment.amount * investment.investmentLevel.percentage) / 100;
        const hourlyReturnRate = dailyReturnRate / 24; // Divide by 24 to get hourly rate
        totalHourlyReturnRate += hourlyReturnRate;
      }
    );

    res.status(200).json({ hourlyReturnRate: totalHourlyReturnRate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching hourly return rate" });
  }
};

// Controller to claim promotional balance
export const claimPromotionBalance = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Assume req.user contains the authenticated user's ID
    const userId = req.user?._id;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any promotional balance
    if (user.promotionalBalance <= 0) {
      return res
        .status(400)
        .json({ message: "No promotional balance to claim" });
    }

    // Transfer promotional balance to main balance
    user.balance += user.promotionalBalance;
    user.promotionalBalance = 0; // Reset promotional balance

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "Promotional balance claimed successfully" });
  } catch (error) {
    console.error("Error claiming promotional balance:", error);
    return res
      .status(500)
      .json({ error: "Error claiming promotional balance" });
  }
};

export const addReferrer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { referralCode } = req.body;

    // Find the user
    const user: any = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a referrer
    if (user.invitedBy) {
      return res.status(400).json({ message: "Referrer already added" });
    }

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ message: "Invalid referrer code " });
    }

    // Update the user's invitedBy field
    user.invitedBy = referrer._id;
    await user.save();

    return res.status(200).json({
      message: "Referrer added successfully",
      invitedBy: user.invitedBy,
    });
  } catch (error) {
    console.error("Error adding referrer:", error);
    return res.status(500).json({ error: "Error adding referrer" });
  }
};
