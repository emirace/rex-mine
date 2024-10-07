import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useUser } from "../contexts/Auth";
import { withdrawal } from "../services/withdrawal";
import { useNavigate } from "react-router-dom";
import TransactionCode from "../components/transactionCode/EnterCode";
import { FaCheck } from "react-icons/fa";

const WithdrawalRequest: React.FC = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const navigate = useNavigate();

  const validation = () => {
    const amountValue = parseFloat(amount);

    if (amountValue <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }
    console.log(amountValue, user?.balance);
    if (
      amountValue >
      (user?.miningBalance || 0) + (user?.promotionalBalance || 0)
    ) {
      setErrorMessage("Insufficient balance.");
      return;
    }

    if (!walletAddress) {
      setErrorMessage("Please enter your TRX wallet address.");
      return;
    }

    if (!isValidTRXAddress(walletAddress)) {
      setErrorMessage("Please enter a valid TRX wallet address.");
      return;
    }
    setShowTransactionModal(true);
  };

  const handleWithdrawal = async (code: string) => {
    setShowTransactionModal(false);
    const amountValue = parseFloat(amount);

    try {
      setLoading(true);
      setErrorMessage("");
      await withdrawal({
        amount: amountValue,
        cryptoAddress: walletAddress,
        code,
      });
      setShowModal(true);
      setLoading(false);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const isValidTRXAddress = (address: string): boolean => {
    // Simple validation for TRX addresses: they should start with 'T' and be 34 characters long
    return address.startsWith("T") && address.length === 34;
  };

  return (
    <div className="flex flex-col  p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Withdraw TRX</h1>

      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-white mb-2">
            Withdrawal Amount
          </label>
          <p className="text-xs mb-1 text-white">
            Withdrawal Amount(Mining + promotionL Balance) ={" "}
            {(
              (user?.miningBalance || 0) + (user?.promotionalBalance || 0)
            ).toFixed(2)}
          </p>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="bg-secondary rounded-full p-4 text-white placeholder-gray-400 w-full"
            // min="1"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="walletAddress" className="text-white mb-2">
            TRX Wallet Address
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter TRX wallet address"
            className="bg-secondary rounded-full p-4 text-white placeholder-gray-400 w-full"
            required
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <Button
          type="button"
          onClick={validation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          disabled={
            !amount || !walletAddress || loading || parseFloat(amount) < 0.1
          }
          loading={loading}
        >
          Submit Withdrawal
        </Button>

        <div className="bg-secondary p-4 rounded-lg shadow-lg w-full text-white">
          <p className="text-yellow-300 font-semibold mb-2">
            Important Information:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Withdrawal amount is from 4TRX - 20millionTRX.</li>
            <li>Withdrawal may take up to 10 minutes to arrive.</li>
            <li>5% fee is charge for withdrrawal</li>
            <li>Do not use any address other than trc20 network</li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
        }}
      >
        <TransactionCode onSubmitCode={handleWithdrawal} />
      </Modal>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate("/home");
        }}
      >
        <div className="p-6 text-white flex flex-col justify-center items-center">
          <FaCheck className="text-white bg-green-400 text-5xl rounded-full p-2 mb-4" />
          <h2 className="text-xl font-bold mb-4">Withdrawal Confirmation</h2>
          <p className="text-center">
            Your withdrawal request for {amount} TRX has been submitted to the
            following address:
          </p>
          <p className="break-words">{walletAddress}</p>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawalRequest;
