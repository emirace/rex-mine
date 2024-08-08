import { IoMdPower } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/Auth";
function Navbar() {
  const location = useLocation();
  const { logout, user } = useUser();

  const notAllowedRoutes = ["/profile"];
  return (
    <>
      <div className="fixed top-0 left-0 z-20  right-0 bg-background flex px-6 py-2 justify-between items-center text-white shadow-sm shadow-primary">
        <Link to="/" className="font-bold text-xl">
          <img src="/images/logo.png" alt="logo" className="w-12" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="capitalize text-white font-medium ">
            Welcome {user?.username}
          </div>
          <a
            href="https://t.me/rex_mine_agent" // Replace with your Telegram channel URL
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // For security purposes
          >
            <BiSupport size={28} className="cursor-pointer text-white" />
          </a>
          {notAllowedRoutes.includes(location.pathname) && (
            <IoMdPower
              onClick={() => logout()}
              size={28}
              className="text-red-500 cursor-pointer"
            />
          )}
        </div>
      </div>
      <div className="h-[60px] w-full" />
    </>
  );
}

export default Navbar;
