import api from "./api";

export interface InvestmentLevel {
  _id: string;
  name: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  validDays: number;
  paybackCycleDays: number;
}

export const getInvestmentLevels = async (): Promise<InvestmentLevel[]> => {
  try {
    const response = await api.get<InvestmentLevel[]>("/investment-levels");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createInvestmentLevel = async (data: {
  name: string;
  percentage: string;
  minAmount: string;
  maxAmount: string;
  validDays: string;
  paybackCycleDays: string;
}): Promise<InvestmentLevel> => {
  try {
    const response = await api.post<{ level: InvestmentLevel }>(
      "/investment-levels/",
      data
    );
    return response.data.level;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
