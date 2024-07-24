import React from "react";
import { MdOutlinePayment } from "react-icons/md";
import { SlSpeedometer } from "react-icons/sl";
import { PiHandWithdrawLight } from "react-icons/pi";
import { BiTransfer } from "react-icons/bi";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "../components/Caroisel";
import { SiBinance } from "react-icons/si";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-2xl">
      {/* Carousel */}

      <Carousel />
      <div className="mt-6 w-full ">
        <div className="flex justify-center items-center mb-2">
          <div className="flex mb-4 bg-secondary rounded-full px-6 p-3 items-center gap-2">
            <span className="text-white opacity-80">Speed :</span>
            <span className="text-white font-bold">0 TRX/h</span>
          </div>
        </div>
        <div onClick={() => navigate("/mine")} className="relative mb-6">
          <div className="absolute inset-0 flex z-10 justify-center items-center">
            <span className="text-white text-xs">Tap To Start Mining</span>
          </div>
          <div className="w-48 h-48 rounded-full flex justify-center items-center animate-spin bg-gradient-to-br from-blue-800 to-indigo-900 mx-auto">
            <div className="w-40 h-40 rounded-full bg-background"></div>
          </div>
        </div>

        <div className="flex justify-center items-center mb-4">
          <div className="text-center mb-4 bg-secondary rounded-full px-4 py-2">
            <span className="text-white opacity-80">Status: </span>
            <span className="text-red-500 font-bold">Inactive</span>
          </div>
        </div>

        <button className="w-full bg-secondary text-white rounded-full py-4 px-6 mb-4 flex items-center justify-between">
          <SlSpeedometer size={28} />
          <span className="font-medium">Boost X2</span>
          <div />
        </button>
        <div className="grid grid-cols-3 justify-around py-8">
          <Link
            className="flex justify-center items-center flex-col"
            to="/deposit"
          >
            <div className="bg-secondary rounded-full p-3 mx-1">
              <MdOutlinePayment className="text-white" size={28} />
            </div>
            <div className="text-white">Deposit</div>
          </Link>

          <Link
            className="flex justify-center items-center flex-col"
            to="/withdrawal"
          >
            <div className="bg-secondary rounded-full p-3 mx-1">
              <PiHandWithdrawLight className="text-white" size={28} />
            </div>
            <div className="text-white">Withdrawal</div>
          </Link>
          <Link className="flex justify-center items-center flex-col" to="#">
            <div className="bg-secondary rounded-full p-3 mx-1">
              <BiTransfer className="text-white" size={28} />
            </div>
            <div className="text-white">Transfer</div>
          </Link>
        </div>
      </div>

      {/* Partners Section */}
      <div className="w-full  mt-8">
        <h2 className="text-white text-xl font-bold mb-4 ">Our Partners</h2>
        <div className="flex justify-around items-center">
          <SiBinance className="text-white" size={28} />
          <FaApple className="text-white" size={28} />
          <FaGoogle className="text-white" size={28} />
          <FaMicrosoft className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
};

export default Home;
