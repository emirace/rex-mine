import { Request, Response } from "express";
import InvestmentLevel from "../models/investmentLevel";

// Create a new investment level
export const createInvestmentLevel = async (req: Request, res: Response) => {
  const {
    name,
    percentage,
    validDays,
    minAmount,
    maxAmount,
    paybackCycleDays,
  } = req.body;

  try {
    const newLevel = new InvestmentLevel({
      name,
      percentage,
      validDays,
      minAmount,
      maxAmount,
      paybackCycleDays,
    });

    await newLevel.save();

    res
      .status(201)
      .json({ message: "Investment level created", level: newLevel });
  } catch (error) {
    res.status(500).json({ error: "Error creating investment level" });
  }
};

// Get all investment levels
export const getInvestmentLevels = async (_req: Request, res: Response) => {
  try {
    const levels = await InvestmentLevel.find();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ error: "Error fetching investment levels" });
  }
};

// Get a specific investment level
export const getInvestmentLevel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const level = await InvestmentLevel.findById(id);
    if (!level) {
      return res.status(404).json({ message: "Investment level not found" });
    }
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ error: "Error fetching investment level" });
  }
};

// Update an investment level
export const updateInvestmentLevel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    percentage,
    validDays,
    minAmount,
    maxAmount,
    paybackCycleDays,
  } = req.body;

  try {
    const level = await InvestmentLevel.findByIdAndUpdate(
      id,
      { name, percentage, validDays, minAmount, maxAmount, paybackCycleDays },
      { new: true }
    );

    if (!level) {
      return res.status(404).json({ message: "Investment level not found" });
    }

    res.status(200).json({ message: "Investment level updated", level });
  } catch (error) {
    res.status(500).json({ error: "Error updating investment level" });
  }
};

// Delete an investment level
export const deleteInvestmentLevel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const level = await InvestmentLevel.findByIdAndDelete(id);

    if (!level) {
      return res.status(404).json({ message: "Investment level not found" });
    }

    res.status(200).json({ message: "Investment level deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting investment level" });
  }
};
