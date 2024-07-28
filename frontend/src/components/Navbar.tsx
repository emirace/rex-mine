import { IoMdPower } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { useUser } from "../contexts/Auth";
function Navbar() {
  const location = useLocation();
  const { logout } = useUser();

  const notAllowedRoutes = ["/profile"];
  return (
    <>
      <div className="fixed top-0 left-0 z-20  right-0 bg-background flex p-4 justify-between items-center text-white shadow-sm shadow-primary">
        <div className="font-bold text-xl">LOGO</div>
        <div className="flex items-center gap-3">
          <BiSupport size={28} />
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
