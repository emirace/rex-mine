import { Transaction } from "../contexts/Transaction";
import api from "./api";

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`/transactions`);
  return response.data;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(`/transactions/all`);
  return response.data;
};
