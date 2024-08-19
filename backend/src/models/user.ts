// src/models/user.ts

import mongoose, { Document, Schema } from "mongoose";

// Define the User interface extending Document
export interface User extends Document {
  fullName: string;
  username: string;
  referralCode: string;
  invitedBy?: mongoose.Schema.Types.ObjectId;
  password: string;
  role: string;
  balance: number;
  miningBalance: number;
  promotionalBalance: number;
  tempPromotionalBalance: number;
  transactionCode?: string;
  hasTransactionCode: boolean;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    referralCode: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    password: { type: String, required: true },
    role: { type: String, default: "User" },
    balance: { type: Number, default: 0 },
    miningBalance: { type: Number, default: 0 },
    promotionalBalance: { type: Number, default: 0 },
    tempPromotionalBalance: { type: Number, default: 0 },
    transactionCode: { type: String },
    hasTransactionCode: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Export the User model
export default mongoose.model<User>("User", UserSchema);
