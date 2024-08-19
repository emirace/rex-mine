import React, { createContext, useContext, useState, useEffect } from "react";
import {
  WithdrawalData,
  withdrawal,
  fetchAllWithdrawal,
  fetchWithdrawal,
  updateWithdrawal,
  Withdrawal,
} from "../services/withdrawal";
import { useUser } from "./Auth";

interface WithdrawalContextProps {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
  createWithdrawal: (data: WithdrawalData) => Promise<void>;
  getWithdrawal: (id: string) => Promise<Withdrawal>;
  getAllWithdrawals: () => Promise<void>;
  updateWithdrawalStatus: (id: string, status: string) => Promise<void>;
}

const WithdrawalContext = createContext<WithdrawalContextProps | undefined>(
  undefined
);

export const WithdrawalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchCurrentUser } = useUser();

  const createWithdrawal = async (data: WithdrawalData) => {
    try {
      setLoading(true);
      const response = await withdrawal(data);
      setWithdrawals((prev) => [...prev, response.withdrawal]);
      fetchCurrentUser();
    } catch (err) {
      setError("Error creating withdrawal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWithdrawal = async (id: string): Promise<Withdrawal> => {
    try {
      setLoading(true);
      const withdrawal = await fetchWithdrawal(id);
      return withdrawal;
    } catch (err) {
      setError("Error fetching withdrawal");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await fetchAllWithdrawal();
      setWithdrawals(data);
    } catch (err) {
      setError("Error fetching withdrawals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateWithdrawalStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const updatedWithdrawal = await updateWithdrawal(id, status);
      setWithdrawals((prev) =>
        prev.map((withdrawal) =>
          withdrawal._id === id ? updatedWithdrawal : withdrawal
        )
      );
    } catch (err) {
      setError("Error updating withdrawal status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllWithdrawals();
  }, []);

  return (
    <WithdrawalContext.Provider
      value={{
        withdrawals,
        loading,
        error,
        createWithdrawal,
        getWithdrawal,
        getAllWithdrawals,
        updateWithdrawalStatus,
      }}
    >
      {children}
    </WithdrawalContext.Provider>
  );
};

export const useWithdrawal = () => {
  const context = useContext(WithdrawalContext);
  if (context === undefined) {
    throw new Error("useWithdrawal must be used within a WithdrawalProvider");
  }
  return context;
};
