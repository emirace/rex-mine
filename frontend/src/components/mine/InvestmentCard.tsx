// src/components/InvestmentCard.tsx

import React, { useState } from "react";
import { FaBolt } from "react-icons/fa";
import { UserInvestment } from "../../services/userInvestment";
import { useUserInvestment } from "../../contexts/UserInvestment";
import Button from "../Button";
import Modal from "../Modal";
import TextInput from "../TextInput";

interface UserInvestmentCardProps {
  investment: UserInvestment;
}

const InvestmentCard: React.FC<UserInvestmentCardProps> = ({ investment }) => {
  const { amount, startDate, endDate, investmentLevel } = investment;
  const { invest } = useUserInvestment(); // Hook to handle investment actions

  const [showModal, setShowModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvest = async () => {
    setError("");
    try {
      setLoading(true);
      await invest({ levelId: investment.investmentLevel, amount: newAmount });
      setLoading(false);
      setShowModal(false);
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.message || error.message);
    }
  };

  // Calculate the percentage of the investment period completed
  const calculateProgress = () => {
    const totalDuration =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    const elapsedDuration =
      new Date().getTime() - new Date(startDate).getTime();
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100); // Ensure it doesn't exceed 100%
    return progress;
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="flex flex-col bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4">
      <div className="flex justify-between items-center">
        <h4 className="text-white font-bold">Level {investmentLevel.name}</h4>
        <div className="flex items-center text-primary">
          <FaBolt />
          <span className="ml-2">Boost X1</span>
        </div>
      </div>
      <p className="text-white text-sm mt-2">
        <strong>Amount:</strong> TRX{amount.toFixed(2)}
      </p>
      <p className="text-white text-sm">
        <strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}
      </p>
      <p className="text-white text-sm mb-4">
        <strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-green-500 h-4 rounded-full animate-pulse"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-right text-xs font-semibold text-white">
        {progressPercentage.toFixed(1)}% Complete
      </p>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-4">
          <h4 className="text-white font-bold mb-2">
            Level {investment.investmentLevel}
          </h4>
          <p className="text-white mb-2 text-sm">
            Amount require to purchase: ${amount.toFixed(2)}
          </p>
          <TextInput
            placeholder="Enter additional amount"
            type="text"
            onChange={(e) => setNewAmount(e.target.value)}
            value={newAmount}
          />
          {error && <div className="text-xs text-red-500">{error}</div>}
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleInvest}
            className="bg-primary text-white mt-4"
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InvestmentCard;
