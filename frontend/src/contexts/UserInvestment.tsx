import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  claimInvestment,
  createInvestment,
  getUserInvestments,
  UserInvestment,
} from "../services/userInvestment";
import { useUser } from "./Auth";

interface UserInvestmentContextType {
  userInvestments: UserInvestment[];
  invest: (data: { levelId: string; amount: string }) => Promise<void>;
  claim: (id: string) => Promise<void>;
  isClaimable: boolean;
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
  const [isClaimable, setIsClaimable] = useState(false);

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

  const claim = async (id: string) => {
    try {
      const investmentRes = await claimInvestment(id);
      setUserInvestments((prev) =>
        prev.map((investment) =>
          investment._id === investmentRes._id ? investmentRes : investment
        )
      );
    } catch (error) {
      console.error("Failed to claim investment:", error);
      throw error;
    }
  };

  useEffect(() => {
    const res = userInvestments.some(
      (investment) => investment.isClaimable || false
    );
    setIsClaimable(res);
  }, [userInvestments]);

  useEffect(() => {
    if (user) {
      getAllInvestmentLevels();
    }
  }, [user]);

  return (
    <UserInvestmentContext.Provider
      value={{ userInvestments, isClaimable, invest, claim }}
    >
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
