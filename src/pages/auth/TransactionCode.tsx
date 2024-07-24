import React, { useState } from "react";
import EnterCode from "../../components/transactionCode/EnterCode";
import VerifyCode from "../../components/transactionCode/VerifyCode";
import { useNavigate } from "react-router-dom";

const TransactionCode: React.FC = () => {
  const [step, setStep] = useState<"enter" | "verify">("enter");
  const [transactionCode, setTransactionCode] = useState("");
  const navigate = useNavigate();
  const handleCodeSubmission = (code: string) => {
    setTransactionCode(code);
    setStep("verify");
  };

  const handleVerificationSuccess = () => {
    navigate("/");
  };

  return (
    <>
      {step === "enter" ? (
        <EnterCode onSubmitCode={handleCodeSubmission} />
      ) : (
        <VerifyCode
          transactionCode={transactionCode}
          onVerifySuccess={handleVerificationSuccess}
        />
      )}
    </>
  );
};

export default TransactionCode;
