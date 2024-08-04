import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Auth";
import { useTransaction } from "../contexts/Transaction";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";

const Profile: React.FC = () => {
  const { user, claimPromotion } = useUser();
  const { transactions, fetchUserTransactions } = useTransaction();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPromotion, setLoadingPromotion] = useState(false);
  const [error, setError] = useState("");

  const handlefetchTransaction = async () => {
    try {
      setLoading(true);
      await fetchUserTransactions();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClaimPromotion = async () => {
    setError("");
    try {
      setLoadingPromotion(true);
      await claimPromotion();
      alert("Balance claimed successfully");
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message);
    } finally {
      setLoadingPromotion(false);
    }
  };

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] text-white p-6 rounded-lg shadow-md mb-8 w-full ">
        <h2 className="text-xl font-bold">Current Balance</h2>
        <p className="text-3xl mt-4">{user?.balance} TRX</p>
      </div>
      <div className="flex items-center justify-between rounded-full bg-secondary py-2 px-4 ">
        <div className="text-white text-lg">
          Promotion Balane: {user?.promotionalBalance} TRX
        </div>
        <button
          disabled={loadingPromotion}
          onClick={handleClaimPromotion}
          className=" bg-blue-600 text-xs text-white rounded-full p-1 px-2"
        >
          {loadingPromotion ? "Claiming..." : "CLAIM"}
        </button>
      </div>
      {error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : (
        <div className="h-4" />
      )}

      {/* Deposit and Withdrawal Buttons */}
      <div className="flex w-full space-x-4 my-8">
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
        <div className="w-full flex justify-between items-center">
          <h2 className="text-white text-xl font-bold mb-4">
            Transaction History
          </h2>
          <ImSpinner9
            onClick={handlefetchTransaction}
            className={loading ? `animate-spin mr-4` : "mr-4"}
            size={20}
            color="white"
          />
        </div>
        <div className="bg-secondary rounded-lg p-4 text-white shadow-md">
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className="flex justify-between items-center border-b border-gray-600 pb-2"
                >
                  <div>
                    <p className="font-semibold capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      {moment(transaction.createdAt).format("")}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${
                        transaction.type === "Withdrawal"
                          ? "text-red-500"
                          : "text-green-500"
                      } font-semibold`}
                    >
                      {transaction.type === "Withdrawal" ? "-" : "+"}
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
