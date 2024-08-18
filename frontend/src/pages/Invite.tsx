// src/components/Invite.tsx

import React, { useEffect, useState } from "react";
import {
  FaArrowTurnDown,
  FaFacebook,
  FaRegCopy,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import { IoMdArrowForward } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { useUser } from "../contexts/Auth";
import { ImSpinner9 } from "react-icons/im";
import { getReferrals } from "../services/user";
import Loading from "../components/Loading";
import api from "../services/api";

export interface Referral {
  username: string;
  level: number;
  referrals?: Referral[]; // Nested referrals for Level 2
}

const Invite: React.FC = () => {
  const { user, addReffererCode } = useUser();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [referrals, setReferrals] = useState<
    { fullName: string; username: string; bonusAmount: number }[]
  >([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [errorReferrals, setErrorReferrals] = useState("");
  const [referralTreeType, setReferralTreeType] = useState("Bonus");
  const [referralTree, setReferralTree] = useState<Referral[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoadingReferrals(true);
        setErrorReferrals("");
        const data = await getReferrals();
        setReferrals(data.referrals);
      } catch (error) {
        setErrorReferrals("Failed to fetch referrals");
      } finally {
        setLoadingReferrals(false);
      }
    };

    fetchReferrals();
  }, []);

  useEffect(() => {
    const fetchReferralTree = async () => {
      try {
        const response = await api.get<Referral[]>(`/users/referral-tree`);
        setReferralTree(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load referral data");
        setLoading(false);
      }
    };

    fetchReferralTree();
  }, []);

  const shareText = `Join me and get rewards using my referral code: ${user?.referralCode}`;
  const website = "https://www.rex-mine.com";
  // Share on Facebook
  const shareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      website // Replace with your site URL
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookShareUrl, "_blank");
  };

  // Share on Telegram
  const shareOnTelegram = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      website // Replace with your site URL
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramShareUrl, "_blank");
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + website // Replace with your site URL
    )}`;
    window.open(whatsappShareUrl, "_blank");
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(website)}`; // Replace with your site URL
    window.open(twitterShareUrl, "_blank");
  };

  // Generic share (for mobile devices with Web Share API)
  const genericShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join and Earn Rewards!",
          text: shareText,
          url: website, // Replace with your site URL
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  const handleAddRefferer = async () => {
    if (!code) {
      setError("Enter referral code");
      return;
    }
    setError("");
    try {
      setLoading(true);
      await addReffererCode({ referralCode: code });
      alert("Referral added successfully");
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="p-6 h-full w-full max-w-2xl text-white mb-16">
        <div className="flex items-center mb-8 gap-5">
          <h1 className="text-2xl font-bold  text-center">Refer & Get Coin</h1>
        </div>
        <p className="font-medium text-xl ">Invite And Get Coin</p>
        <p className=" mb-6">Copy your code, share it with your friends</p>
        <div className="bg-secondary rounded-full p-4 flex justify-between items-center">
          <span className="text-white">{user?.referralCode}</span>
          <FaRegCopy
            className="text-white cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(user?.referralCode || "")
            }
            size={24}
          />
        </div>
        <div className="py-6 text-center">Or</div>
        <div className="flex justify-around items-center mb-4 ">
          <button
            className="bg-secondary  rounded-full p-3 mx-1"
            onClick={shareOnFacebook}
          >
            <FaFacebook
              className="text-blue-600 bg-white rounded-full"
              size={28}
            />
          </button>
          <button
            className="bg-secondary  rounded-full p-3 mx-1"
            onClick={shareOnTelegram}
          >
            <FaTelegram
              className="text-blue-400 bg-white rounded-full"
              size={28}
            />
          </button>
          <button
            className="bg-secondary  rounded-full p-3 mx-1"
            onClick={shareOnWhatsApp}
          >
            <IoLogoWhatsapp className="text-green-400" size={28} />
          </button>
          <button
            className="bg-secondary text-white rounded-full p-3 mx-1"
            onClick={shareOnTwitter}
          >
            <FaXTwitter size={28} />
          </button>
          <button
            className="bg-secondary text-white rounded-full p-3 mx-1"
            onClick={genericShare}
          >
            <LuShare2 size={28} />
          </button>
        </div>
        <div className="my-10 bg-secondary p-4 rounded-lg">
          <div className="flex justify-between bg-primary bg-opacity-70 p-2 px-4 rounded-md mb-2">
            <span className="bg-[#d6be0c] text-white font-bold rounded-full w-7 h-7 justify-center items-center flex">
              1
            </span>
            <span>1st Level </span>
            <span>7%</span>
          </div>
          <div className="flex justify-between bg-primary bg-opacity-30 p-2 px-4 rounded-md">
            <span className="bg-[#bbbbba] text-white font-bold rounded-full w-7 h-7 justify-center items-center flex">
              2
            </span>
            <span>2nd Level </span>
            <span>3%</span>
          </div>
        </div>
        <div className="my-10 bg-secondary p-6 rounded-lg">
          <div className="font-medium text-lg mb-2">Refferal level Rules</div>
          After Level 1 friend successfully deposit and invest you will get a
          commission of 7% of their investment, and if level 1 invites a person
          and they invest, you will get a commission of 3%. it can be withdrawn
          for investment or your crypto wallet at any time
        </div>
        {!user?.invitedBy && (
          <>
            {" "}
            <p className="font-medium text-xl mt-6 mb-4 ">Invitation Code</p>
            <div className="flex items-center rounded-full bg-secondary py-1 px-2 pl-4">
              <input
                type="text"
                placeholder="Enter Refer Code"
                className="w-full bg-transparent outline-none"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
              <button
                onClick={handleAddRefferer}
                className=" bg-blue-600 text-white rounded-full p-2"
              >
                {loading ? (
                  <ImSpinner9 size={28} className={"animate-spin"} />
                ) : (
                  <IoMdArrowForward size={28} />
                )}
              </button>
            </div>
            {error && <div className="text-xs text-red-500">{error}</div>}
          </>
        )}

        <p id="teams" className="font-medium text-xl mt-6 mb-4 ">
          My Team
        </p>

        <div className="flex items-center text-white font-medium min-h-14 mb-4 border border-white rounded-full p-2 ">
          <div
            onClick={() => setReferralTreeType("Bonus")}
            className={`flex-1 text-center transition-all ${
              referralTreeType === "Bonus" && "bg-primary p-2 rounded-full "
            }`}
          >
            Bonus
          </div>
          <div
            onClick={() => setReferralTreeType("Tree")}
            className={`flex-1 text-center transition-all ${
              referralTreeType === "Tree" && "bg-primary p-2 rounded-full "
            }`}
          >
            Tree
          </div>
        </div>
        {referralTreeType === "Bonus" && (
          <div className="bg-secondary rounded-lg p-4 text-white shadow-md">
            {loadingReferrals ? (
              <Loading />
            ) : errorReferrals ? (
              <p>{errorReferrals}</p>
            ) : referrals.length > 0 ? (
              <ul className="space-y-4">
                {referrals.map((referral) => (
                  <li
                    key={referral.username}
                    className="flex justify-between items-center border-b border-gray-600 pb-2"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {referral.fullName}
                      </p>
                      <p className="text-sm text-gray-400">
                        @{referral.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-500 font-semibold">
                        ${referral.bonusAmount.toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No referrals bonus.</p>
            )}
          </div>
        )}
        {referralTreeType === "Tree" && (
          <div className="p-4 bg-secondary  text-white shadow rounded">
            {referralTree?.length ? (
              <ul className="space-y-4">
                {referralTree.map((level1User, index) => (
                  <li key={index}>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{level1User.username}</p>
                      <FaArrowTurnDown />
                    </div>
                    {level1User.referrals?.length ? (
                      <ul className="pl-6 list-disc">
                        {level1User.referrals.map((level2User, index) => (
                          <li key={index}>{level2User.username} (Level 2)</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm pl-6 ">No Level 2 referrals.</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Level 1 referrals.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invite;
