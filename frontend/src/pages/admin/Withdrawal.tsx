import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWithdrawal } from "../../contexts/WithdrawalRequest";
import Loading from "../../components/Loading";

const Withdrawal = () => {
  const { withdrawals, getAllWithdrawals } = useWithdrawal();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        await getAllWithdrawals();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold text-white mb-4">
        Withdrawal Requests
      </h1>
      {withdrawals.length > 0 ? (
        <div className="overflow-x-auto text-white">
          <table className="min-w-full shadow-md rounded-lg">
            <thead>
              <tr className="">
                <th className="py-2 px-4 text-left text-white">User</th>
                <th className="py-2 px-4 text-left text-white">Amount (TRX)</th>
                <th className="py-2 px-4 text-left text-white">
                  Crypto Address
                </th>
                <th className="py-2 px-4 text-left text-white">Status</th>
                <th className="py-2 px-4 text-left text-white">Created At</th>
                <th className="py-2 px-4 text-left text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="border-b">
                  <td className="py-2 px-4">
                    <p className="font-semibold text-white">
                      {withdrawal.userId?.fullName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {withdrawal.userId?.username || "N/A"}
                    </p>
                  </td>
                  <td className="py-2 px-4">{withdrawal.amount}</td>
                  <td className="py-2 px-4">{withdrawal.cryptoAddress}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        withdrawal.status === "Pending"
                          ? "bg-yellow-500"
                          : withdrawal.status === "Approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/withdrawals/${withdrawal._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No withdrawal requests found.</p>
      )}
    </div>
  );
};

export default Withdrawal;
