// src/components/AdminUserDetail.js

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../contexts/Auth";
import Loading from "../../components/Loading";
import { User } from "../../services/user";
import { Transaction } from "../../contexts/Transaction";
import { UserInvestment } from "../../services/userInvestment";

const AdminUserDetail = () => {
  const { userId } = useParams();
  const { fetchUserById } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!userId) return;
        const userData = await fetchUserById(userId);
        setUser(userData.user);
        setTransactions(userData.transactions);
        setInvestments(userData.investments);
      } catch (error) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6  rounded-lg ">
      <h2 className="text-3xl font-bold text-white mb-6">User Details</h2>
      {user ? (
        <div>
          <div className="mb-6">
            <p className="text-lg text-white">
              <strong>Full Name:</strong> {user.fullName}
            </p>
            <p className="text-lg text-white">
              <strong>Username:</strong> @{user.username}
            </p>
            <p className="text-lg text-white">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="text-lg text-white">
              <strong>Balance:</strong> {user.balance}TRX
            </p>
            <p className="text-lg text-white">
              <strong>Mining Balance:</strong> {user.miningBalance}
              TRX
            </p>
            <p className="text-lg text-white">
              <strong>Promotional Balance:</strong>
              {user.promotionalBalance.toFixed(2)}TRX
            </p>
            <p className="text-lg text-white">
              <strong>Unclaim Promotional Balance:</strong>
              {(user.tempPromotionalBalance || 0).toFixed(2)}TRX
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Transaction History
            </h3>
            <div className="bg-secondary rounded-lg p-4 text-white ">
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
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`${
                            !transaction.incoming
                              ? "text-red-500"
                              : "text-green-500"
                          } font-semibold`}
                        >
                          {!transaction.incoming ? "-" : "+"}
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

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Investment History
            </h3>
            <div className="bg-secondary rounded-lg p-4 text-white ">
              {investments.length > 0 ? (
                <ul className="space-y-4">
                  {investments.map((investment) => (
                    <li
                      key={investment._id}
                      className="flex justify-between items-center border-b border-gray-600 pb-2"
                    >
                      <div>
                        <p className="font-semibold">
                          Investment Level: {investment.investmentLevel.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          Start Date:{" "}
                          {new Date(investment.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-green-500 font-semibold">
                          {investment.amount} TRX
                        </p>
                        <p className="text-sm text-gray-400">
                          End Date:{" "}
                          {new Date(investment.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No investments found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-500">User not found.</p>
      )}
    </div>
  );
};

export default AdminUserDetail;
