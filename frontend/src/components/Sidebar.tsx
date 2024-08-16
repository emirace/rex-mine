import { FaRegUser } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { RiHomeLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { PiHandDeposit, PiHandWithdraw, PiMoney } from "react-icons/pi";
import { useUser } from "../contexts/Auth";

const navbarLinks = [
  {
    path: "/home",
    text: "Home",
    icon: <RiHomeLine size={24} />,
  },
  {
    path: "/mine",
    text: "Mine",
    icon: <IoWalletOutline size={24} />,
  },
  {
    path: "/invite",
    text: "Invite",
    icon: <LuShare2 size={24} />,
  },
  {
    path: "/profile",
    text: "Profile",
    icon: <FaRegUser size={24} />,
    end: true,
  },
];

const adminNavbarLinks = [
  {
    path: "/admin/users",
    text: "Users",
    icon: <CiUser size={24} />,
  },
  {
    path: "/admin/withdrawals",
    text: "Withdrawals",
    icon: <PiHandWithdraw size={24} />,
  },
  {
    path: "/admin/investments",
    text: "Investments",
    icon: <PiHandDeposit size={24} />,
  },
  {
    path: "/admin/transactions",
    text: "Transactions",
    icon: <PiMoney size={24} />,
  },
];

function Sidebar() {
  const { user } = useUser();
  return (
    <nav className=" overflow-y-auto hidden md:block scrollbar-hide h-full p-6 w-1/5 shadow  shadow-primary ">
      <ul className="">
        {navbarLinks.map((link) => (
          <li
            key={link.text}
            className="mb-3 text-base hover:font-medium transition-all duration-300 "
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `${
                  isActive && "bg-primary px-6 "
                } flex items-center gap-2 rounded-full py-2 text-white transition-all  `
              }
              //   end={link.end}
            >
              {link.icon}
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
      {user?.role === "Admin" && (
        <>
          <div className="text-white font-bold p-4 border-t border-white mt-6">
            Admin
          </div>
          <ul className="">
            {adminNavbarLinks.map((link) => (
              <li
                key={link.text}
                className="mb-3 text-base hover:font-medium transition-all duration-300 "
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `${
                      isActive && "bg-primary px-6 "
                    } flex items-center gap-2 rounded-full py-2 text-white transition-all  `
                  }
                  //   end={link.end}
                >
                  {link.icon}
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}

export default Sidebar;
