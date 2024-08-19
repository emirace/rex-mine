import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useTransaction } from "../../contexts/Transaction";
import moment from "moment";
import { Link } from "react-router-dom";

const Transactions = () => {
  const { fetchAllTransactions } = useTransaction();
  const [transactions, setTransactions] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetchAllTransactions();
        setTransactions(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction requests:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
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
        All Transactions
      </h1>
      <div className="bg-secondary rounded-lg p-4 text-white shadow-md">
        {transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((transaction: any) => (
              <li
                key={transaction._id}
                className="flex justify-between items-center border-b border-gray-600 pb-2"
              >
                <div>
                  <Link
                    to={`/admin/users/${transaction.userId._id}`}
                    className="font-semibold capitalize underline"
                  >
                    {transaction.userId.username}
                  </Link>
                  <p className="font-semibold capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-400">
                    {moment(transaction.createdAt).calendar()}
                  </p>
                </div>
                <div>
                  <p
                    className={`${
                      !transaction.incoming ? "text-red-500" : "text-green-500"
                    } font-semibold`}
                  >
                    {!transaction.incoming ? "-" : "+"}
                    {transaction.amount.toFixed(2)} TRX
                  </p>
                  <p className="text-sm text-gray-400">{transaction.status}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
