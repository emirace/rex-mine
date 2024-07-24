import React from "react";
import { FaFacebook, FaRegCopy, FaTelegram, FaXTwitter } from "react-icons/fa6";
import { IoMdArrowForward } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";

const Invite: React.FC = () => {
  const referralCode = "DBTFUSG3134";

  return (
    <div className="flex flex-col ">
      <div className="p-6 h-full w-full max-w-2xl text-white mb-16">
        <div className="flex items-center mb-8 gap-5">
          {/* <IoArrowBackSharp
            color="white"
            size={28}
            onClick={() => navigate(-1)}
          /> */}
          <h1 className="text-2xl font-bold  text-center">Refer & Get Coin</h1>
        </div>
        <p className="font-medium text-xl ">Invite And Get Coin</p>
        <p className=" mb-6">Copy your code, share it with your friends</p>
        <div className="bg-secondary rounded-full p-4 flex justify-between items-center">
          <span className="text-white">{referralCode}</span>
          <FaRegCopy
            className="text-white"
            onClick={() => navigator.clipboard.writeText(referralCode)}
            size={24}
          />
        </div>
        <div className="py-6 text-center">Or</div>
        <div className="flex justify-around items-center mb-4 ">
          <button className="bg-secondary  rounded-full p-3 mx-1">
            <FaFacebook
              className="text-blue-600 bg-white rounded-full"
              size={28}
            />
          </button>
          <button className="bg-secondary  rounded-full p-3 mx-1">
            <FaTelegram
              className="text-blue-400 bg-white rounded-full"
              size={28}
            />
          </button>
          <button className="bg-secondary  rounded-full p-3 mx-1">
            <IoLogoWhatsapp className="text-green-400" size={28} />
          </button>
          <button className="bg-secondary text-white rounded-full p-3 mx-1">
            <FaXTwitter size={28} />
          </button>
          <button className="bg-secondary text-white rounded-full p-3 mx-1">
            <LuShare2 size={28} />
          </button>
        </div>
        <div className="my-10 bg-secondary p-6 rounded-lg">
          <div className="flex justify-between">
            <span>10 Referrals</span>
            <span>150 TRX</span>
          </div>
          <div className="flex justify-between">
            <span>20 Referrals</span>
            <span>500 TRX</span>
          </div>
          <div className="flex justify-between">
            <span>30 Referrals</span>
            <span>2000 TRX</span>
          </div>
        </div>
        <p className="font-medium text-xl mt-6 mb-4 ">Invitation Code</p>
        <div className="flex items-center rounded-full bg-secondary py-1 px-2 pl-4">
          <input
            type="text"
            placeholder="Enter Refer Code"
            className="w-full bg-transparent outline-none"
          />
          <button className=" bg-blue-600 text-white rounded-full p-2">
            <IoMdArrowForward size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invite;
