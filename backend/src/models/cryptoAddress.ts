import mongoose, { Document, Schema } from "mongoose";

// Define the CryptoAddress interface extending Document
export interface CryptoAddress extends Document {
  address: string;
  userId: mongoose.Schema.Types.ObjectId;
}

// Define the CryptoAddress schema
const cryptoAddressSchema: Schema = new Schema(
  {
    address: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the CryptoAddress model
export default mongoose.model<CryptoAddress>(
  "CryptoAddress",
  cryptoAddressSchema
);
