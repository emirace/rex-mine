// src/context/TransactionContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { getTransactions, getAllTransactions } from "../services/transaction";

export interface Transaction {
  _id: string;
  amount: number;
  userId: string;
  status: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionContextProps {
  transactions: Transaction[];
  fetchUserTransactions: () => Promise<void>;
  fetchAllTransactions: () => Promise<Transaction[]>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchUserTransactions = async () => {
    try {
      const userTransactions = await getTransactions();
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Failed to fetch user transactions:", error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const allTransactions = await getAllTransactions();
      return allTransactions;
    } catch (error) {
      console.error("Failed to fetch all transactions:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUserTransactions(); // Optionally fetch transactions on mount
  }, []);

  return (
    <TransactionContext.Provider
      value={{ transactions, fetchUserTransactions, fetchAllTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = (): TransactionContextProps => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};
