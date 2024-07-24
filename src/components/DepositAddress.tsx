import React from "react";
import { FaRegCopy } from "react-icons/fa6";
//@ts-ignore
import QRCode from "react-qr-code";

interface Props {
  address: string;
}
const DepositAddress: React.FC<Props> = ({ address }) => {
  return (
    <div>
      <div className="mt-8">
        <div className="text-white pb-4 font-bold">Deposit Address</div>

        <div className="flex flex-col justify-center items-center gap-5 md:flex-row mb-4">
          <div className="bg-white h-[178px] w-[178px] p-1 flex justify-center items-center ">
            <QRCode
              value={address}
              style={{ heigt: "170px", width: "170px" }}
            />
          </div>
          <div className="text-white text-sm bg-secondary p-2 rounded-lg">
            <div className="font-bold text-primary">TRX</div>
            <p className="mb-2">
              Always double-check the address and the amount before sending. We
              cannot recover funds sent to the wrong address.The final amount is
              calculated once your deposit confirms on the network.
            </p>
            <p>
              Scan the QR code or copy the address and send your desired amount.
              Your deposit will be confirmed after 1 confirmation on the
              network.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-secondary rounded-full p-4">
          <input
            type="text"
            id="trxAddress"
            value={address}
            readOnly
            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
          />
          <FaRegCopy
            className="text-white"
            onClick={() => navigator.clipboard.writeText(address)}
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default DepositAddress;
