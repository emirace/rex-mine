import mongoose, { Document, Schema } from "mongoose";

interface Transaction extends Document {
  amount: number;
  userId: mongoose.Schema.Types.ObjectId;
  status: string;
  type: "Depodit" | "Withdrawal" | "Transfer";
  providerId: string;
}

const transactionSchema = new Schema<Transaction>(
  {
    amount: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "Pending" },
    providerId: { type: String },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Transfer"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Transaction>("Transaction", transactionSchema);
