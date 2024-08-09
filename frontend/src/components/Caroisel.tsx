import { useState, useEffect } from "react";

const carouselImages = [
  {
    caption: "Welcome to REX-MINE",
    subCaption:
      "Experience secure and fast transactions with TRX. REX-MINE offers a seamless and efficient way to manage your cryptocurrency investments with real-time updates and user-friendly features.",
  },
  {
    caption: "Boost Your Earnings",
    subCaption:
      "Maximize your earnings by taking advantage of our exclusive double-speed mining feature. Accelerate your mining process and see quicker results with enhanced performance.",
  },
  {
    caption: "Stay Informed",
    subCaption:
      "Stay up-to-date with the latest updates, features, and improvements. We provide comprehensive information and news to help you make informed decisions and stay ahead in the crypto world.",
  },
  {
    caption: "Secure Transactions",
    subCaption:
      "REX-MINE ensures the highest level of security for all transactions. Enjoy peace of mind knowing that your funds and personal information are protected with advanced encryption and security protocols.",
  },
  {
    caption: "User-Friendly Interface",
    subCaption:
      "Navigate REX-MINE with ease thanks to our intuitive and user-friendly interface. Whether you're a beginner or an experienced user, you'll find our tools and features straightforward and accessible.",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full flex-shrink-0"
            style={{ minWidth: "100%" }} // Ensure each item takes full width
          >
            <div className="bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] rounded-lg h-48 sm:h-56 md:h-64 lg:h-72 flex items-center p-4">
              <div className="text-white">
                <h2 className="text-lg font-bold shadow-md">{image.caption}</h2>
                <p className="text-xs">{image.subCaption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 rounded-full p-1 absolute bottom-2 right-2 bg-opacity-70">
        {carouselImages.map((_, index) => (
          <div
            key={index} // Added key prop for mapping
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 cursor-pointer ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            } rounded-full`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
