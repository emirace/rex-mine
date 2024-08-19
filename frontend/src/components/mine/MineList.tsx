import { useState } from "react";
import { useInvestmentLevel } from "../../contexts/InvestmentLevel";
import Card from "../Card";
import Modal from "../Modal";
import TextInput from "../TextInput";
import Button from "../Button";

function MineList() {
  const { investmentLevels, create } = useInvestmentLevel();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [paybackCycleDays, setPaybackCycleDays] = useState("");
  const [percentage, setPercentage] = useState("");
  const [validDays, setValidDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      await create({
        maxAmount,
        minAmount,
        name,
        paybackCycleDays,
        percentage,
        validDays,
      });
      setLoading(false);
      setShowModal(false);
      setName("");
      setMaxAmount("");
      setMinAmount("");
      setPaybackCycleDays("");
      setPercentage("");
      setValidDays("");
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* <Button
        onClick={() => setShowModal(true)}
        className="border border-primary text-primary mb-4"
      >
        Add Level
      </Button> */}
      <div className="flex flex-col gap-6">
        {investmentLevels.map((level) => (
          <Card
            levelId={level._id}
            days={`${level.validDays}`}
            payback={`${level.paybackCycleDays}`}
            level={level.name}
            percentage={level.percentage}
            minAmount={level.minAmount}
            cost={`${level.minAmount} - ${level.maxAmount}`}
          />
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-4">
          <div className="text-white font-bold">Add Mining Level</div>
          <TextInput
            placeholder="Enter Level e.g 1"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            placeholder="Enter daily percentage"
            type="text"
            value={`${percentage}`}
            onChange={(e) => setPercentage(e.target.value)}
          />

          <TextInput
            placeholder="Enter minimun investment"
            type="text"
            value={`${minAmount}`}
            onChange={(e) => setMinAmount(e.target.value)}
          />

          <TextInput
            placeholder="Enter maximun investment"
            type="text"
            value={`${maxAmount}`}
            onChange={(e) => setMaxAmount(e.target.value)}
          />

          <TextInput
            placeholder="Enter Valid days"
            type="text"
            value={`${validDays}`}
            onChange={(e) => setValidDays(e.target.value)}
          />

          <TextInput
            placeholder="Enter Payback cycle days"
            type="text"
            value={`${paybackCycleDays}`}
            onChange={(e) => setPaybackCycleDays(e.target.value)}
          />
          <div>
            {error && <div className="text-xs text-red-500">{error}</div>}
            <Button
              loading={loading}
              disabled={loading}
              onClick={handleCreate}
              className="bg-primary text-white mt-4"
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MineList;
