import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth";
import CryptoAddress from "../models/cryptoAddress";
import {
  callbackCheckPostCoinpaymentsData,
  callbackCheckPostCoinpaymentsHmac,
  callbackCheckPostCoinpaymentsTransaction,
  callbackCoinpaymentsCreateHmac,
  generateCryptoAddress,
} from "../utils/cryptoAddress";
import Transaction from "../models/transaction";
import User from "../models/user";

let callbackBlockTransactionCrypto: any = [];

export const getCryptoAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Await the findOne call to ensure it completes before proceeding
    let userAddress = await CryptoAddress.findOne({ userId });

    // If userAddress doesn't exist, create a new one
    if (!userAddress) {
      const address: any = await generateCryptoAddress();
      console.log(address);
      userAddress = await CryptoAddress.create({
        address: address.address,
        userId,
      });
    }

    // Return the found or newly created address
    res.status(200).json({ address: userAddress.address });
  } catch (error) {
    console.error("Error processing investment:", error);
    res.status(500).json({ error: "Error processing investment" });
  }
};

export const coinpaymentIpn = async (req: Request, res: Response) => {
  try {
    // Validate sent data
    callbackCheckPostCoinpaymentsData(req.headers, req.body);

    // Create sha512 hmac for sent body
    const hmac = callbackCoinpaymentsCreateHmac(req.body);

    // Validate sent hmac
    callbackCheckPostCoinpaymentsHmac(hmac, req.headers);

    // Get transaction id and currency
    const transactionId =
      req.body.ipn_type === "deposit" ? req.body.deposit_id : req.body.id;
    const currency = req.body.currency.toLowerCase();

    // Validate crypto transaction
    callbackCheckPostCoinpaymentsTransaction(
      transactionId,
      callbackBlockTransactionCrypto
    );

    // Add transactions id to crypto block array
    callbackBlockTransactionCrypto.push(transactionId.toString());
    try {
      // Get crypto address and crypto transaction from database
      const [cryptoAddress, transaction]: any = await Promise.all([
        CryptoAddress.findOne({ address: req.body.address })
          .select("address userId")
          .populate({
            path: "userId",
            select: "invitedBy",
            populate: {
              path: "invitedBy",
              select: "invitedBy",
            },
          })
          .lean(),
        Transaction.findOne({ providerId: transactionId })
          .select("amount userId status")
          .lean(),
      ]);

      if (
        req.body.ipn_type === "deposit" &&
        cryptoAddress &&
        !transaction &&
        req.body.status >= 100
      ) {
        // Get transaction amount
        const amount = req.body.amount;

        // Create an array of promises for database operations
        const promises: any = [
          User.findByIdAndUpdate(
            cryptoAddress.userId._id,
            {
              $inc: { balance: amount },
            },
            { new: true }
          )
            .select("balance  updatedAt")
            .lean(),
          Transaction.create({
            amount: amount,
            providerId: transactionId,
            type: "Deposit",
            incoming: true,
            userId: cryptoAddress.userId._id,
            status: "Completed",
          }),
        ];

        // Deposit bonus
        promises.push(
          User.findByIdAndUpdate(
            cryptoAddress.userId._id,
            {
              $inc: { balance: amount * 0.1 },
            },
            {}
          ),
          Transaction.create({
            amount: amount * 0.1,
            type: "DepositBonus",
            incoming: true,
            status: "Completed",
            userId: cryptoAddress.userId._id,
          })
        );

        // Execute promises array queries
        const result = await Promise.all(promises);
        console.log(result);
      } else {
        console.log("check 3");
      }

      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Internal transaction processing error:", err);
      res.status(500).json({
        success: false,
        error: { type: "error", message: err.message },
      });
    } finally {
      // Always remove the transaction id from the crypto block array
      const index = callbackBlockTransactionCrypto.indexOf(
        transactionId.toString()
      );
      if (index !== -1) {
        callbackBlockTransactionCrypto.splice(index, 1);
      }
    }
  } catch (err: any) {
    console.error("IPN processing error:", err);
    res.status(500).json({
      success: false,
      error: { type: "error", message: err.message },
    });
  }
};
