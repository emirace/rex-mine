import mongoose, { Document, Schema } from "mongoose";

// Define the InvestmentLevel interface extending Document
export interface InvestmentLevel extends Document {
  name: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  validDays: number;
  paybackCycleDays: number;
}

// Define the InvestmentLevel schema
const InvestmentLevelSchema: Schema = new Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  validDays: { type: Number, required: true },
  paybackCycleDays: { type: Number, required: true },
});

// Export the InvestmentLevel model
export default mongoose.model<InvestmentLevel>(
  "InvestmentLevel",
  InvestmentLevelSchema
);
