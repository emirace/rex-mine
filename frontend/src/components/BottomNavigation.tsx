import React from "react";
import { NavLink } from "react-router-dom";
import { RiHomeLine } from "react-icons/ri";
import { IoWalletOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";

const navbarLinks = [
  {
    path: "/home",
    text: "Home",
    icon: <RiHomeLine size={28} />,
  },
  {
    path: "/mine",
    text: "Mine",
    icon: <IoWalletOutline size={28} />,
  },
  {
    path: "/invite",
    text: "Invite",
    icon: <LuShare2 size={28} />,
  },
  {
    path: "/profile",
    text: "Profile",
    icon: <FaRegUser size={28} />,
    end: true,
  },
];
const BottomNavigation: React.FC = () => {
  return (
    <div className="md:hidden">
      <div className="fixed bottom-0  left-0 right-0 bg-secondary shadow-lg py-2 flex justify-between px-4 items-center">
        {navbarLinks.map((link) => (
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `${
                isActive && "bg-primary px-6 "
              } flex items-center gap-2 rounded-full py-2 text-white transition-all  `
            }
            //   end={true}
          >
            {({ isActive }) =>
              isActive ? (
                <>
                  {link.icon}
                  <span className="text-xs">{link.text}</span>
                </>
              ) : (
                link.icon
              )
            }
          </NavLink>
        ))}
      </div>
      <div className="h-[64px]" />
    </div>
  );
};

export default BottomNavigation;
