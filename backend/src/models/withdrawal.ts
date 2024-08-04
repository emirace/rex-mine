import mongoose, { Document, Schema } from "mongoose";

export interface Withdrawal extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  amount: number;
  cryptoAddress: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    cryptoAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Withdrawal>("Withdrawal", WithdrawalSchema);
