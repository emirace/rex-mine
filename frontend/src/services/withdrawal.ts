import api from "./api";

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  cryptoAddress: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalData {
  amount: number;
  cryptoAddress: string;
}

export const withdrawal = async (
  data: WithdrawalData
): Promise<{ withdrawal: Withdrawal }> => {
  try {
    const response = await api.post<{ withdrawal: Withdrawal }>(
      "/withdrawals",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
