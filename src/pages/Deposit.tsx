import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import DepositAddress from "../components/DepositAddress";

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [address] = useState("jdjdbkdjsskehfbrn3333een");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const MIN_DEPOSIT_AMOUNT = 10;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amount);

    if (amountValue < MIN_DEPOSIT_AMOUNT) {
      setErrorMessage(`Minimum deposit amount is ${MIN_DEPOSIT_AMOUNT} TRX.`);
      return;
    }

    setErrorMessage(""); // Clear error message if validation passes
    setShowModal(true);
  };

  const handleAmountSuggestionClick = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
    setErrorMessage(""); // Clear error message when a suggested amount is clicked
  };

  const handleChange = (element: string) => {
    const value = element.replace(/\D/g, "");
    setAmount(value);
    setErrorMessage(""); // Clear error message when user changes the input
  };

  return (
    <div className="flex flex-col  p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Deposit TRX</h1>

      <form onSubmit={handleDeposit} className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-white mb-2">
            Deposit Amount
          </label>

          <div className="flex justify-between md:justify-start md:gap-3 mt-2 mb-4">
            {[10, 50, 100, 500].map((suggestedAmount) => (
              <button
                key={suggestedAmount}
                type="button"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded-full transition duration-300"
                onClick={() => handleAmountSuggestionClick(suggestedAmount)}
              >
                {suggestedAmount} TRX
              </button>
            ))}
          </div>
          <div className="flex items-center bg-secondary rounded-full p-4">
            <span className="text-white font-bold mr-2">TRX</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter amount"
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              min="1"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          disabled={!amount}
        >
          Confirm Deposit
        </Button>

        <div className="bg-secondary p-4 rounded-lg shadow-lg w-full text-white">
          <p className="text-yellow-300 font-semibold mb-2">
            Important Information:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Minimum deposit amount is 10 TRX.</li>
            <li>Deposits may take up to 10 minutes to process.</li>
            <li>
              Ensure the deposit address is correct to avoid loss of funds.
            </li>
          </ul>
        </div>
      </form>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <DepositAddress address={address} />
      </Modal>
    </div>
  );
};

export default Deposit;
