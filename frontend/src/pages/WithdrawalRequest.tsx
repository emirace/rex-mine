import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useUser } from "../contexts/Auth";
import { withdrawal } from "../services/withdrawal";

const WithdrawalRequest: React.FC = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amount);

    if (amountValue <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    if (amountValue > (user?.balance ? user?.balance : 0)) {
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
    try {
      setLoading(true);
      setErrorMessage("");
      await withdrawal({ amount: amountValue, cryptoAddress: walletAddress });
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

      <form onSubmit={handleWithdrawal} className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-white mb-2">
            Withdrawal Amount
          </label>
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
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          disabled={!amount || !walletAddress || loading}
          loading={loading}
        >
          Submit Withdrawal
        </Button>
      </form>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <div className="p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Withdrawal Confirmation</h2>
          <p>
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
