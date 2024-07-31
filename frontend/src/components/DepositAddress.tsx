import React, { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import QRCode from "react-qr-code";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import default styles
import { getAddress } from "../services/crypto";

const DepositAddress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getCryptoAddress = async () => {
      try {
        const address = await getAddress();
        setAddress(address);
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setLoading(false);
      }
    };
    getCryptoAddress();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    // Hide the copied message after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <SkeletonTheme baseColor="#2b2e4a" highlightColor="#323556">
      <div>
        <div className="mt-8">
          <div className="text-white pb-4 font-bold">Deposit Address</div>

          <div className="flex flex-col justify-center items-center gap-5 md:flex-row mb-4">
            {loading ? (
              <Skeleton height={172} width={172} />
            ) : (
              <div className="bg-white h-[178px] w-[178px] p-1 flex justify-center items-center">
                <QRCode
                  value={address}
                  style={{ height: "170px", width: "170px" }}
                />
              </div>
            )}
            <div className="text-white text-sm bg-secondary p-2 rounded-lg">
              <div className="font-bold text-primary">TRX</div>
              <p className="mb-2">
                Always double-check the address and the amount before sending.
                We cannot recover funds sent to the wrong address. The final
                amount is calculated once your deposit confirms on the network.
              </p>
              <p>
                Scan the QR code or copy the address and send your desired
                amount. Your deposit will be confirmed after 1 confirmation on
                the network.
              </p>
            </div>
          </div>

          {loading ? (
            <Skeleton
              containerClassName="flex-1"
              height={60}
              borderRadius={30}
              width="100%"
            />
          ) : (
            <div className="flex items-center justify-between bg-secondary rounded-full p-4">
              <>
                <input
                  type="text"
                  id="trxAddress"
                  value={address}
                  readOnly
                  className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                />
                {copied ? (
                  <span className="text-primary ml-2">Copied!</span>
                ) : (
                  <FaRegCopy
                    className="text-white"
                    onClick={handleCopy}
                    size={24}
                  />
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default DepositAddress;
