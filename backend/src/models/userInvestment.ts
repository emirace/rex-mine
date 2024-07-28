// src/models/userInvestment.ts

import mongoose, { Document, Schema } from "mongoose";

// Define the UserInvestment interface extending Document
export interface UserInvestment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  investmentLevel: mongoose.Schema.Types.ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date; // End date for the investment
  nextPaybackDate: Date;
}

// Define the UserInvestment schema
const UserInvestmentSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  investmentLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvestmentLevel",
    required: true,
  },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, // Include end date
  nextPaybackDate: { type: Date, required: true },
});

// Export the UserInvestment model
export default mongoose.model<UserInvestment>(
  "UserInvestment",
  UserInvestmentSchema
);
