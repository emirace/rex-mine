import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Auth";

interface Transaction {
  id: number;
  date: string;
  type: "Deposit" | "Withdrawal";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [transactions] = useState<Transaction[]>([]);
  //   [
  //   {
  //     id: 1,
  //     date: "2024-07-20",
  //     type: "Deposit",
  //     amount: 100,
  //     status: "Completed",
  //   },
  //   {
  //     id: 2,
  //     date: "2024-07-18",
  //     type: "Withdrawal",
  //     amount: 50,
  //     status: "Completed",
  //   },
  //   {
  //     id: 3,
  //     date: "2024-07-15",
  //     type: "Deposit",
  //     amount: 200,
  //     status: "Pending",
  //   },
  // ]

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] text-white p-6 rounded-lg shadow-md mb-8 w-full ">
        <h2 className="text-xl font-bold">Current Balance</h2>
        <p className="text-3xl mt-4">{user?.balance} TRX</p>
      </div>
      <div className="flex items-center justify-between rounded-full bg-secondary py-2 px-4 mb-8">
        <div className="text-white text-lg">
          Promotion Balane: {user?.promotionalBalance} TRX
        </div>
        <button className=" bg-blue-600 text-white rounded-full p-2 px-4">
          CLAIM
        </button>
      </div>

      {/* Deposit and Withdrawal Buttons */}
      <div className="flex w-full space-x-4 mb-8">
        <Button
          onClick={() => navigate("/deposit")}
          className="bg-primary w-full text-white font-bold py-2 px-4 transition duration-300"
        >
          Deposit
        </Button>
        <Button
          onClick={() => navigate("/withdrawal")}
          className="border border-primary w-full text-primary font-bold py-2 px-4  transition duration-300"
        >
          Withdraw
        </Button>
      </div>

      {/* Transaction History */}
      <div className="w-full">
        <h2 className="text-white text-xl font-bold mb-4">
          Transaction History
        </h2>
        <div className="bg-secondary rounded-lg p-4 text-white shadow-md">
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center border-b border-gray-600 pb-2"
                >
                  <div>
                    <p className="font-semibold">{transaction.type}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                  <div>
                    <p
                      className={`${
                        transaction.type === "Deposit"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-semibold`}
                    >
                      {transaction.type === "Deposit" ? "+" : "-"}
                      {transaction.amount} TRX
                    </p>
                    <p className="text-sm text-gray-400">
                      {transaction.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
