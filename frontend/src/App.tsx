import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./contexts/Auth";

const App = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
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
          Join our platform and maximize your TRX earnings with our reliable and
          efficient mining solutions. Get started now and take advantage of our
          lucrative plans designed for everyone.
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
      <div className="absolute right-5 bottom-5 text-white font-medium flex gap-5 items-center">
        <div className="">About US</div>
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="">Term of Use</div>
      </div>
    </div>
  );
};

export default App;
