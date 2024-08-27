import { useState, useEffect, useRef } from "react";
import bgImg from "/images/pexels-anna-tarazevich-14751274.jpg";
import { CiUser } from "react-icons/ci";
import { GoSmiley } from "react-icons/go";
import { FaMoneyBill, FaRegHandshake } from "react-icons/fa";

function Statistics() {
  const [counterOn, setCounterOn] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCounterOn(true);
          observer.disconnect(); // Stop observing once counters start
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderCounter = (end: number) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!counterOn) return;

      let start = 0;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, [counterOn, end]);

    return <span>{count}</span>;
  };

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="relative min-h-[500px] flex items-center justify-center font-montserrat"
    >
      <div className="absolute bg-black/70 top-0 left-0 w-full h-full"></div>
      <div className="container w-[90%] mx-auto py-10 relative z-1 grid grid-cols-1 text-white font-roboto md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center">
          <CiUser size={50} />
          <div className="py-4 flex text-5xl font-bold">
            {renderCounter(360)}K+
          </div>
          <hr className="w-[10%]" />
          <p className="py-4">Accumulated Participants</p>
        </div>
        <div className="flex flex-col items-center">
          <FaMoneyBill size={50} />
          <div className="py-4 flex text-5xl font-bold">
            {renderCounter(12)}M+ TRX
          </div>
          <hr className="w-[10%]" />
          <p className="py-4 capitalize">Investments</p>
        </div>
        <div className="flex flex-col items-center">
          <GoSmiley size={50} />
          <div className="py-4 flex text-5xl font-bold">
            {renderCounter(14)}M+ TRX
          </div>
          <hr className="w-[10%]" />
          <p className="py-4 capitalize">Withdrawals</p>
        </div>
        <div className="flex flex-col items-center">
          <FaRegHandshake size={50} />
          <div className="py-4 flex text-5xl font-bold">
            {renderCounter(700)}+
          </div>
          <hr className="w-[10%]" />
          <p className="py-4 capitalize">partnerships</p>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
