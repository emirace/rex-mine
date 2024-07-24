import { FaRegUser } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { RiHomeLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const navbarLinks = [
  {
    path: "/",
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

function Sidebar() {
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
    </nav>
  );
}

export default Sidebar;
