import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createInvestmentLevel,
  getInvestmentLevels,
  InvestmentLevel,
} from "../services/investmentLevel";

interface InvestmentLevelContextType {
  investmentLevels: InvestmentLevel[];
  create: (data: {
    name: string;
    percentage: string;
    minAmount: string;
    maxAmount: string;
    validDays: string;
    paybackCycleDays: string;
  }) => Promise<void>;
}
const InvestmentLevelContext = createContext<
  InvestmentLevelContextType | undefined
>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const InvestmentLevelProvider: React.FC<UserProviderProps> = ({
  children,
}) => {
  const [investmentLevels, setInvestmentLevels] = useState<InvestmentLevel[]>(
    []
  );
  const getAllInvestmentLevels = async () => {
    try {
      const investmentLevels = await getInvestmentLevels();
      setInvestmentLevels(investmentLevels);
    } catch (error) {
      console.error("Failed to fetch investment levels:", error);
    }
  };

  const create = async (data: {
    name: string;
    percentage: string;
    minAmount: string;
    maxAmount: string;
    validDays: string;
    paybackCycleDays: string;
  }) => {
    try {
      const investmentLevel = await createInvestmentLevel(data);
      setInvestmentLevels((prev) => [...prev, investmentLevel]);
    } catch (error) {
      console.error("Failed to fetch investment levels:", error);
      throw error;
    }
  };

  useEffect(() => {
    getAllInvestmentLevels();
  }, []);

  return (
    <InvestmentLevelContext.Provider value={{ investmentLevels, create }}>
      {children}
    </InvestmentLevelContext.Provider>
  );
};

export const useInvestmentLevel = (): InvestmentLevelContextType => {
  const context = useContext(InvestmentLevelContext);
  if (context === undefined) {
    throw new Error(
      "useInvestmentLevel must be used within an InvestmentLevelProvider"
    );
  }
  return context;
};
