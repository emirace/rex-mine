import React, { useEffect, useState } from "react";
import { MdOutlinePayment } from "react-icons/md";
import { SlSpeedometer } from "react-icons/sl";
import { PiHandWithdrawLight } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "../components/Caroisel";
import { getHourlyReturnRate } from "../services/user";
import { ImArrowDown } from "react-icons/im";
import { useUser } from "../contexts/Auth";
import { useUserInvestment } from "../contexts/UserInvestment";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isClaimable } = useUserInvestment();
  const [hourlyRate, setHourlyRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHourlyReturn();
  }, []);

  const getHourlyReturn = async () => {
    try {
      setLoading(true);
      const rate = await getHourlyReturnRate();
      console.log(rate);
      setHourlyRate(rate);
    } catch (error) {
      console.log(error);
      setHourlyRate(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      {/* Carousel */}
      <Carousel />
      <div className="mt-6 w-full ">
        <div className="flex justify-center items-center mb-2">
          {loading ? (
            <div className="bg-secondary h-12 rounded-full w-52 mb-4 animate-pulse" />
          ) : (
            <div
              className="flex mb-4 bg-secondary rounded-full px-6 p-3 items-center gap-2"
              onClick={getHourlyReturn}
            >
              <span className="text-white opacity-80">Speed :</span>
              <span className="text-white font-bold">
                {hourlyRate.toFixed(4)} TRX/h
              </span>
            </div>
          )}
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex z-10 justify-center items-center">
            {loading ? (
              <div />
            ) : isClaimable ? (
              <span
                className="relative flex "
                onClick={() => navigate("/mine?status=true")}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full text-white px-4 py-2 bg-primary">
                  Claim
                </span>
              </span>
            ) : hourlyRate ? (
              <div className="flex flex-col justify-center items-center">
                <div className="animate-bounce">
                  <ImArrowDown color={"white"} size={24} />
                </div>
                <div className="text-white text-xs font-bold">Mining</div>
              </div>
            ) : (
              <span
                onClick={() => navigate("/mine")}
                className="text-white text-xs"
              >
                Tap To Start Mining
              </span>
            )}
          </div>
          <div className="w-48 h-48 rounded-full flex justify-center items-center animate-spin bg-gradient-to-br from-blue-800 to-indigo-900 mx-auto">
            <div className="w-40 h-40 rounded-full bg-background"></div>
          </div>
        </div>

        <div className="flex justify-center items-center mb-4">
          {loading ? (
            <div className="bg-secondary h-10 rounded-full w-32 mb-4 animate-pulse" />
          ) : (
            <div className="text-center mb-4 bg-secondary rounded-full px-4 py-2">
              <span className="text-white opacity-80">Status: </span>
              {hourlyRate ? (
                <span className="text-green-500 font-bold">Active</span>
              ) : (
                <span className="text-red-500 font-bold">Inactive</span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-full bg-black text-center text-white rounded-full py-4 px-6 mb-4 flex items-center justify-between">
            <span className="font-medium">
              Mining Balance: {user?.miningBalance.toFixed(2)}TRX
            </span>
            <div />
          </div>
          <div className="w-full bg-black text-white text-center rounded-full py-4 px-6 mb-4 flex items-center justify-between">
            <span className="font-medium">
              Promotion Balance: {user?.promotionalBalance.toFixed(2)}TRX
            </span>
            <div />
          </div>
        </div>

        <button
          onClick={() => navigate("/mine?status=true")}
          className="w-full bg-primary bg-opacity-70  text-white rounded-full py-4 px-6 mb-4 flex items-center justify-between"
        >
          <SlSpeedometer size={28} />
          <span className="font-medium">Boost X2</span>
          <div />
        </button>
        <div className="grid grid-cols-3 justify-around py-8">
          <Link
            className="flex justify-center items-center flex-col"
            to="/deposit"
          >
            <div className="bg-primary rounded-full p-3 mx-1">
              <MdOutlinePayment className="text-white" size={28} />
            </div>
            <div className="text-white">Deposit</div>
          </Link>

          <Link
            className="flex justify-center items-center flex-col"
            to="/withdrawal"
          >
            <div className="bg-yellow-800 rounded-full p-3 mx-1">
              <PiHandWithdrawLight className="text-white" size={28} />
            </div>
            <div className="text-white">Withdrawal</div>
          </Link>
          <Link
            className="flex justify-center items-center flex-col"
            to="/invite/#teams"
          >
            <div className="bg-purple-800 rounded-full p-3 mx-1">
              <RiTeamLine className="text-white" size={28} />
            </div>
            <div className="text-white">Team</div>
          </Link>
        </div>
      </div>

      {/* Partners Section */}
      <div className="w-full  mt-8">
        <h2 className="text-white text-xl font-bold mb-4 ">Our Partners</h2>
        <div className="flex  items-center justify-between flex-wrap gap-4">
          <img
            src="/images/binance.png"
            className="h-8 rounded min-w-36 bg-white p-1"
          />
          <img
            src="/images/stormgain.jpg"
            className="h-8 rounded min-w-36 bg-white p-1"
          />
          <img
            src="/images/bybit.jpg"
            className="h-8 rounded min-w-36 bg-white p-1"
          />
          <img
            src="/images/coinmarketcap.png"
            className="h-8 rounded min-w-36 bg-white p-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
