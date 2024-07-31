import api from "./api";

export const getAddress = async (): Promise<string> => {
  try {
    const response = await api.get<{ address: string }>("/crypto/address");
    return response.data.address;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
