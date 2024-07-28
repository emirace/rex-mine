import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createInvestment,
  getUserInvestments,
  UserInvestment,
} from "../services/userInvestment";
import { useUser } from "./Auth";

interface UserInvestmentContextType {
  userInvestments: UserInvestment[];
  invest: (data: { levelId: string; amount: string }) => Promise<void>;
}
const UserInvestmentContext = createContext<
  UserInvestmentContextType | undefined
>(undefined);

interface UserInvestmentProviderProps {
  children: ReactNode;
}

export const UserInvestmentProvider: React.FC<UserInvestmentProviderProps> = ({
  children,
}) => {
  const { user } = useUser();
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const getAllInvestmentLevels = async () => {
    try {
      const userInvestments = await getUserInvestments();
      setUserInvestments(userInvestments);
    } catch (error) {
      console.error("Failed to fetch investment levels:", error);
    }
  };

  const invest = async (data: { amount: string; levelId: string }) => {
    try {
      const investmentLevel = await createInvestment(data);
      setUserInvestments((prev) => [...prev, investmentLevel]);
    } catch (error) {
      console.error("Failed to fetch investment levels:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      getAllInvestmentLevels();
    }
  }, [user]);

  return (
    <UserInvestmentContext.Provider value={{ userInvestments, invest }}>
      {children}
    </UserInvestmentContext.Provider>
  );
};

export const useUserInvestment = (): UserInvestmentContextType => {
  const context = useContext(UserInvestmentContext);
  if (context === undefined) {
    throw new Error(
      "useUserInvestment must be used within an UserInvestmentProvider"
    );
  }
  return context;
};
