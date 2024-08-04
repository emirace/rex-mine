import { useUserInvestment } from "../../contexts/UserInvestment";
import InvestmentCard from "./InvestmentCard";

function MineStatus() {
  const { userInvestments } = useUserInvestment();
  return userInvestments.length === 0 ? (
    <div className="text-white text-center">
      No active mining,{" "}
      <span className="font-medium text-primary">Mine Now</span>
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {userInvestments.map((investment) => (
        <InvestmentCard investment={investment} />
      ))}
    </div>
  );
}

export default MineStatus;
