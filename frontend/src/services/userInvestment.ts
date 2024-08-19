import api from "./api";

export interface UserInvestment {
  _id: string;
  userId: string;
  investmentLevel: any;
  amount: number;
  startDate: Date;
  endDate: Date; // End date for the investment
  nextPaybackDate: Date;
  isClaimable: boolean;
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

export const getAllInvestments = async (): Promise<{
  investments: UserInvestment[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
}> => {
  try {
    const response = await api.get<{
      investments: UserInvestment[];
      currentPage: number;
      totalCount: number;
      totalPages: number;
    }>("/investments/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const claimInvestment = async (id: string): Promise<UserInvestment> => {
  try {
    const response = await api.get<UserInvestment>(`/investments/claim/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const boostInvestment = async (
  id: string,
  amount: string
): Promise<UserInvestment> => {
  try {
    const response = await api.put<UserInvestment>(`/investments`, {
      investmentId: id,
      amount,
    });
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
    const response = await api.post<{ investment: UserInvestment }>(
      "/investments/invest",
      data
    );
    return response.data.investment;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
