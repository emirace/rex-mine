// src/contexts/UserContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  getUsers,
  getCurrentUser,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  createTransactionCode,
  addReferrer,
  claimPromotionBalance,
} from "../services/user";
import { Transaction } from "./Transaction";
import { UserInvestment } from "../services/userInvestment";

interface UserContextType {
  user: User | null;
  allUsers: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  fetchUserById: (id: string) => Promise<{
    user: User;
    transactions: Transaction[];
    investments: UserInvestment[];
  }>;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    fullName: string;
    username: string;
    password: string;
    invitationCode: string;
  }) => Promise<void>;
  addReffererCode: (data: { referralCode: string }) => Promise<void>;
  claimPromotion: () => Promise<void>;
  update: (id: string, data: Partial<User>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  logout: () => void;
  createTxnCode: (data: { transactionCode: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id: string) => {
    try {
      const user = await getUserById(id);
      return user;
    } catch (error) {
      console.error(`Failed to fetch user by ID ${id}:`, error);
      throw error;
    }
  };

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const { token, user } = await loginUser(username, password);
      console.log(token, user);
      localStorage.setItem("token", token); // Save token to localStorage
      const currentUser = await getCurrentUser();
      console.log(currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  const register = async (data: {
    fullName: string;
    username: string;
    password: string;
    invitationCode: string;
  }) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.error("Failed to register:", error);
      throw error;
    }
  };

  const createTxnCode = async (data: { transactionCode: string }) => {
    try {
      await createTransactionCode(data);
      setUser((prev) => ({ ...prev, hasTransactionCode: true } as User | null));
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  const addReffererCode = async (data: { referralCode: string }) => {
    try {
      const res = await addReferrer(data);
      setUser((prev) => ({ ...prev, invitedBy: res } as User | null));
    } catch (error) {
      throw error;
    }
  };

  const claimPromotion = async () => {
    try {
      await claimPromotionBalance();
      setUser((prev) => ({ ...prev, promotionalBalance: 0 } as User | null));
    } catch (error) {
      throw error;
    }
  };

  const update = async (id: string, data: Partial<User>) => {
    try {
      const updatedUser = await updateUser(id, data);
      setUser(updatedUser);
    } catch (error) {
      console.error(`Failed to update user with ID ${id}:`, error);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteUser(id);
      setUser(null); // Optionally reset user state
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
    }
  };

  const logout = async () => {
    try {
      console.log("logout");
      localStorage.removeItem("token");
      setUser(null); // Optionally reset user state
    } catch (error) {
      console.error(`Failed logout user`, error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        loading,
        createTxnCode,
        fetchCurrentUser,
        fetchUsers,
        fetchUserById,
        login,
        addReffererCode,
        claimPromotion,
        register,
        update,
        remove,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an UserProvider");
  }
  return context;
};
