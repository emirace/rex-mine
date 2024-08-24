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

import { startSession } from "mongoose";

export const coinpaymentIpn = async (req: Request, res: Response) => {
  const session = await startSession(); // Start a session
  session.startTransaction(); // Start a transaction

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
      // Get crypto address and crypto transaction from the database
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
          .lean()
          .session(session),
        Transaction.findOne({ providerId: transactionId })
          .select("amount userId status")
          .lean()
          .session(session),
      ]);

      if (
        req.body.ipn_type === "deposit" &&
        cryptoAddress &&
        !transaction &&
        req.body.status >= 100
      ) {
        const amount = req.body.amount;

        // Create an array of promises for database operations with the session
        const promises: any = [
          User.findByIdAndUpdate(
            cryptoAddress.userId._id,
            { $inc: { balance: amount } },
            { new: true, session }
          )
            .select("balance updatedAt")
            .lean(),
          Transaction.create(
            [
              {
                amount: amount,
                providerId: transactionId,
                type: "Deposit",
                incoming: true,
                userId: cryptoAddress.userId._id,
                status: "Completed",
              },
            ],
            { session }
          ),
        ];

        // Add deposit bonus promises
        promises.push(
          User.findByIdAndUpdate(
            cryptoAddress.userId._id,
            { $inc: { balance: amount * 0.1 } },
            { session }
          ),
          Transaction.create(
            [
              {
                amount: amount * 0.1,
                type: "DepositBonus",
                incoming: true,
                status: "Completed",
                userId: cryptoAddress.userId._id,
              },
            ],
            { session }
          )
        );

        await Promise.all(promises);

        // Commit the transaction
        await session.commitTransaction();
        console.log("Transaction successful");
      } else {
        console.log("Transaction skipped: No valid transaction found");
      }

      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Internal transaction processing error:", err);
      await session.abortTransaction(); // Abort the transaction on error
      res.status(500).json({
        success: false,
        error: { type: "error", message: err.message },
      });
    } finally {
      session.endSession(); // End the session

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
    await session.abortTransaction(); // Abort the transaction on error
    session.endSession(); // End the session
    res.status(500).json({
      success: false,
      error: { type: "error", message: err.message },
    });
  }
};
