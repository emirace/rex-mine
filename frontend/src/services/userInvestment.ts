import api from "./api";

export interface UserInvestment {
  _id: string;
  userId: string;
  investmentLevel: string;
  amount: number;
  startDate: Date;
  endDate: Date; // End date for the investment
  nextPaybackDate: Date;
}

export const getUserInvestments = async (): Promise<UserInvestment[]> => {
  try {
    const response = await api.get<UserInvestment[]>("/investments");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllInvestments = async (): Promise<UserInvestment[]> => {
  try {
    const response = await api.get<UserInvestment[]>("/investments/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createInvestment = async (data: {
  levelId: string;
  amount: string;
}): Promise<UserInvestment> => {
  try {
    const response = await api.post<{ level: UserInvestment }>(
      "/investments/invest",
      data
    );
    return response.data.level;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
