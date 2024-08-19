import React, { useEffect, useState } from "react";
import { getAllInvestments } from "../../services/userInvestment";

const Investments: React.FC = () => {
  const [investments, setInvestments] = useState<any>([]);

  useEffect(() => {
    // Fetch investments from your API or backend here
    const fetchInvestments = async () => {
      // Example fetch (adjust according to your API)
      const response = await getAllInvestments();
      setInvestments(response.investments);
    };

    fetchInvestments();
  }, []);

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">User Investments</h2>
        <div className="space-y-4">
          {investments.map((investment: any) => (
            <div
              key={investment._id.toString()}
              className="shadow-md rounded-lg p-4 flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">User:</span>
                <span>{investment.userId.username}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Level:</span>
                <span>{investment.investmentLevel.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <span>{investment.amount} TRX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Start Date:</span>
                <span>
                  {new Date(investment.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">End Date:</span>
                <span>{new Date(investment.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Next Payback Date:</span>
                <span>
                  {new Date(investment.nextPaybackDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Claimable:</span>
                <span>{investment.isClaimable ? "Yes" : "No"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Investments;
