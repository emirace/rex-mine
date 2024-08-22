import React, { useState } from "react";
import Button from "./Button";
import { FaBolt, FaCheck } from "react-icons/fa";
import Modal from "./Modal";
import TextInput from "./TextInput";
import { useUserInvestment } from "../contexts/UserInvestment";

interface CardProps {
  levelId: string;
  days: string;
  level: string;
  cost: string;
  minAmount: number;
  payback: string;
  percentage: number;
}

const Card: React.FC<CardProps> = ({
  levelId,
  days,
  minAmount,
  level,
  cost,
  payback,
  percentage,
}) => {
  const { invest } = useUserInvestment();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInvest = async () => {
    setError("");
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < minAmount) {
      setError("Enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      await invest({ levelId, amount });
      setLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex relative bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="">
        <div className="bg-secondary w-10 h-10 flex justify-center items-center font-bold text-white text-2xl  rounded-full  mr-4">
          {level}
        </div>
      </div>
      <div className="absolute top-4 right-4 text-primary flex items-center border border-primary rounded-full px-2">
        <FaBolt />
        Boost X1
      </div>
      <div className="w-full">
        <h4 className="text-white font-bold mb-2">Level {level}</h4>
        <p className="text-white mb-2 text-sm">
          Amount require to purchase: {cost} TRX
        </p>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white mb-2 py-[8px] "
        >
          Mine
        </Button>
        <div className="flex justify-between mb-2 text-sm font-medium items-center w-full text-white">
          <div className="">
            <span className="opacity-80">Valid days:</span> {days}
          </div>{" "}
          <div className="">
            <span className="opacity-80">Reward:</span> {percentage}% daily
          </div>
          <div className="">
            <span className="opacity-80">Payback Cycle:</span> {payback}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setShowSuccess(false);
        }}
      >
        {!showSuccess ? (
          <div className=" p-4">
            <h4 className="text-white font-bold mb-2">Level {level}</h4>
            <p className="text-white mb-2 text-sm">
              Amount require to purchase: {cost}
            </p>
            <p className="text-white text-sm mb-4">Valid days: {days}</p>
            <TextInput
              placeholder="Enter amount"
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
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
        ) : (
          <div className="flex flex-col text-white items-center justify-center">
            <FaCheck className="text-white bg-green-400 text-5xl rounded-full p-2 mb-4" />
            <h2 className="text-xl font-bold mb-4">Mining Confirmation</h2>
            <p className="text-center">
              An amount of {amount} TRX has been successfully invested. Check
              your Mine status to see your investments
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Card;
