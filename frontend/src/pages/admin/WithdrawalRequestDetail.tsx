import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWithdrawal } from "../../contexts/WithdrawalRequest";

const WithdrawalRequestDetail = () => {
  const { id } = useParams(); // Get the withdrawal request ID from the route parameters
  const { getWithdrawal, updateWithdrawalStatus } = useWithdrawal();
  const navigate = useNavigate();
  const [withdrawal, setWithdrawal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWithdrawal = async () => {
      try {
        if (!id) return;
        const response = await getWithdrawal(id);
        setWithdrawal(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching withdrawal request:", err);
        setError("Error fetching withdrawal request");
        setLoading(false);
      }
    };

    fetchWithdrawal();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    try {
      if (!id) return;
      await updateWithdrawalStatus(id, status);
      navigate("/admin/withdrawals"); // Redirect to the withdrawal list page after updating status
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      setError(`Error updating status to ${status}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4  min-h-screen">
      <h1 className="text-2xl font-semibold text-white mb-4">
        Withdrawal Request Detail
      </h1>
      {withdrawal ? (
        <div className=" shadow-md rounded-lg p-6">
          <p className="text-white mb-2">
            <span className="font-semibold">User:</span>{" "}
            {withdrawal.userId?.fullName || "N/A"} (
            {withdrawal.userId?.username || "N/A"})
          </p>
          <p className="text-white mb-2">
            <span className="font-semibold">Amount:</span> {withdrawal.amount}{" "}
            TRX
          </p>
          <p className="text-white mb-2">
            <span className="font-semibold">Crypto Address:</span>{" "}
            {withdrawal.cryptoAddress}
          </p>
          <p className="text-white mb-2">
            <span className="font-semibold">Status:</span>
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
          </p>
          <p className="text-white mb-4">
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(withdrawal.createdAt).toLocaleString()}
          </p>
          <div className="flex space-x-4">
            {withdrawal.status === "Pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("Approved")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate("Rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Withdrawal request not found.</p>
      )}
    </div>
  );
};

export default WithdrawalRequestDetail;
