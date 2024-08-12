import api from "./api";

export interface Withdrawal {
  _id: string;
  userId: { _id: string; fullName: string; username: string };
  amount: number;
  cryptoAddress: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalData {
  amount: number;
  cryptoAddress: string;
  code: string;
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
    console.error("Error posting withdrawal:", error);
    throw error;
  }
};

export const fetchAllWithdrawal = async (): Promise<Withdrawal[]> => {
  try {
    const response = await api.get<Withdrawal[]>("/withdrawals");
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};

export const fetchWithdrawal = async (id: string): Promise<Withdrawal> => {
  try {
    const response = await api.get<Withdrawal>(`/withdrawals/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawal:", error);
    throw error;
  }
};

export const updateWithdrawal = async (
  id: string,
  status: string
): Promise<Withdrawal> => {
  try {
    const response = await api.patch<Withdrawal>(`/withdrawals/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    throw error;
  }
};
