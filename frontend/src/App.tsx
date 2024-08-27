import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./contexts/Auth";
import { FaChevronDown, FaMoneyBill } from "react-icons/fa";
import ServiceCard from "./components/home/ServiceCard";
import Statistics from "./components/home/Statistics";
import { useRef } from "react";

import { FaShieldAlt, FaChartLine } from "react-icons/fa";

const services = [
  {
    header: "Mine TRX Efficiently",
    description:
      "Harness the power of cutting-edge mining technology to efficiently mine TRX. Our advanced systems ensure maximum profitability with minimal effort.",
    icon: (
      <FaChartLine className="text-primary text-6xl group-hover:text-white" />
    ),
  },
  {
    header: "Maximize Profits",
    description:
      "Analyze market trends and mining rates to maximize your TRX earnings. We provide data-driven insights to help you stay ahead in the mining game.",
    icon: (
      <FaMoneyBill className="text-primary text-6xl group-hover:text-white" />
    ),
  },
  {
    header: "Secure Your Earnings",
    description:
      "Protect your mined TRX with our high security protocols. Your earnings are stored safely, ensuring peace of mind as you grow your crypto portfolio.",
    icon: (
      <FaShieldAlt className="text-primary text-6xl group-hover:text-white" />
    ),
  },
];

const App = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const aboutRef = useRef<any>(null);

  const handleClick = () => {
    if (!aboutRef.current) return;
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background">
      <div className="relative flex flex-col justify-center min-h-screen bg-hero-pattern bg-cover bg-center text-white px-6">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        {/* Content */}
        <Link to="/" className="font-bold z-10 absolute top-5 left-5 text-xl">
          <img src="/images/logo.png" alt="logo" className="w-12" />
        </Link>
        <div className="relative z-10 flex flex-col justify-center p-8 text-center md:text-left max-w-5xl ">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Start Mining TRX Today with Confidence
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Join our platform and maximize your TRX earnings with our reliable
            and efficient mining solutions. Get started now and take advantage
            of our lucrative plans designed for everyone.
          </p>
          <div>
            <button
              className="bg-primary hover:bg-background  text-white font-bold py-3 px-6 w-1/2 rounded-full transition-colors duration-300"
              onClick={() => navigate(user ? "/home" : "/login")}
            >
              Get Started
            </button>
          </div>
        </div>
        {/* <div className="absolute right-5 bottom-5 text-white font-medium flex gap-5 items-center">
          <div className="">About US</div>
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="">Term of Use</div>
        </div> */}
        <button
          onClick={handleClick}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 "
        >
          <FaChevronDown className="text-white text-4xl animate-bounce" />
        </button>
      </div>
      <div
        ref={aboutRef}
        className=" flex flex-col items-center py-7 md:py-16 text-white"
      >
        <h3 className="text-primary  text-xs md:text-lg">Welcome To RexMine</h3>
        <h2 className="font-bold text-xl md:text-6xl">What we do</h2>
        {/* little line */}
        <div className="w-[50px] md:w-[100px] h-[2px] bg-primary mt-4" />
        {/* paragraph */}
        <p className="p-4 text-xs md:text-lg text-center w-full md:w-[60%]">
          Rex-mine is a crypto trading Website for everyone. It’s a convenient
          solution for those who want to profit from either the growth or
          decline of the cryptocurrency market and from long-term investments in
          crypto assets.
        </p>

        <p className="p-4 text-xs md:text-lg text-center w-full md:w-[60%]">
          Available on any device, Rex-mine allows you to start Mining the most
          popular and most capitalised coins with a multiplier of up to 200x
          Profit returns, And Also with the aim of bringing a great crypto asset
          to reality for better transaction and more profit to client.
        </p>
        <div className="grid md:grid-cols-3 gap-8 w-full md:w-[80%] p-4 mt-7">
          {services.map((service, index) => (
            <ServiceCard
              key={service.header}
              header={service.header}
              description={service.description}
              icon={service.icon}
              number={"O" + (index + 1)}
            />
          ))}
        </div>
      </div>
      <Statistics />
      <div className="w-full  p-8 md:p-16">
        <div className="flex  items-center justify-between flex-wrap gap-4">
          <img
            src="/images/binance.png"
            className="h-8 md:h-20 rounded min-w-32 md:min-w-56 bg-white p-1"
          />
          <img
            src="/images/stormgain.jpg"
            className="h-8 md:h-20 rounded min-w-32 md:min-w-56 bg-white p-1"
          />
          <img
            src="/images/bybit.jpg"
            className="h-8 md:h-20 rounded min-w-32 md:min-w-56 bg-white p-1"
          />
          <img
            src="/images/coinmarketcap.png"
            className="h-8 md:h-20 rounded min-w-32 md:min-w-56 bg-white p-1"
          />
        </div>
      </div>

      <footer className="bg-black min-h-[40vh] flex flex-col items-center font-montserrat">
        <p className="text-white text-lg md:text-2xl font-bold mt-10 mb-5 text-center">
          Over 12Million TRX has been invested with RexMine
        </p>
        <button
          onClick={() => navigate(user ? "/home" : "/login")}
          className="p-2 rounded-md bg-primary text-white font-bold w-[150px] hover:bg-transparent border-white hover:border"
        >
          Get Started
        </button>
        <div className="px-4 py-4  border-t border-white w-full  md:w-[80%] mt-7">
          <div className="">
            <h3 className="text-primary mb-4 text-center">The founders</h3>
            <p className="text-white text-sm text-center">
              REX-MINE LLC Kingstown, St. Vincent and the Grenadines Company No.
              312 LLC 2015 ©️ 2019 Rex-mine
              <br />
              Website Launch date: 2019, July 26th
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
