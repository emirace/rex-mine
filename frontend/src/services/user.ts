// src/services/userService.ts

import { Transaction } from "../contexts/Transaction";
import api from "./api";
import { UserInvestment } from "./userInvestment";

// Define the User interface
export interface User {
  _id: string;
  fullName: string;
  username: string;
  balance: number;
  miningBalance: number;
  role: string;
  promotionalBalance: number;
  hasTransactionCode: boolean;
  referralCode: string;
  invitedBy: string;
  // Add other user fields as needed
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Fetch all users (Admin only)
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get current logged in user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/users/getUser");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Get user by ID (Admin only)
export const getUserById = async (
  id: string
): Promise<{
  user: User;
  transactions: Transaction[];
  investments: UserInvestment[];
}> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Login user
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/users/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Register user
export const registerUser = async (data: {
  fullName: string;
  username: string;
  password: string;
  invitationCode: string;
}): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/users/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const createTransactionCode = async (data: {
  transactionCode: string;
}): Promise<boolean> => {
  try {
    await api.post<string>("/users/create-transaction-code", data);
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const addReferrer = async (data: {
  referralCode: string;
}): Promise<string> => {
  try {
    const res = await api.post<{ invitedBy: string }>(
      "/users/add-referrer",
      data
    );
    return res.data.invitedBy;
  } catch (error) {
    console.error("Error adding refferer:", error);
    throw error;
  }
};

export const claimPromotionBalance = async (): Promise<boolean> => {
  try {
    await api.post<string>("/users/claim-promotion", {});
    return true;
  } catch (error) {
    console.error("Error claimimg promotion:", error);
    throw error;
  }
};

export const getHourlyReturnRate = async (): Promise<number> => {
  try {
    const response = await api.get<{ hourlyReturnRate: number }>(
      "/users/hourly"
    );
    return response.data.hourlyReturnRate;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Update user by ID (Admin only)
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Delete user by ID (Admin only)
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const getReferrals = async () => {
  try {
    const response = await api.get(`/users/referrals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};
