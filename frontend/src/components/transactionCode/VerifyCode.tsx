import React, { useState, useRef } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/Auth";

interface VerificationCodeProps {
  transactionCode: string;
}

const VerifyCode: React.FC<VerificationCodeProps> = ({ transactionCode }) => {
  const { createTxnCode } = useUser();
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/\D/g, ""); // Allow only digits
    if (value.length > 1) return; // Prevent entering more than one digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const enteredOtp = otp.join("");

      if (enteredOtp !== transactionCode) {
        setError("Invalid Verification Code. Please try again.");
        return;
      }

      await createTxnCode({ transactionCode });
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="bg-[#1e203b] p-6 md:rounded-lg shadow-lg md:max-w-md h-screen md:h-auto w-full flex flex-col  ">
        <h2 className="text-white text-2xl font-bold mb-6">Confirm Code</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-16 h-16 text-center text-lg rounded-full bg-[#2b2e4a] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                maxLength={1}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <label htmlFor="terms" className="text-white">
              Confirm your transaction code
            </label>
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4"
            loading={loading}
            disabled={loading || otp.some((digit) => digit === "")}
          >
            Verify
          </Button>
        </form>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default VerifyCode;
