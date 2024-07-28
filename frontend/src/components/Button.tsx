import React from "react";
import { ImSpinner9 } from "react-icons/im";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  className = "",
  onClick,
  icon,
  children,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`w-full py-4 px-6 rounded-full flex items-center justify-center transition duration-300 ${className} ${
        disabled ? "bg-gray-400 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && <ImSpinner9 className="animate-spin mr-2" size={18} />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
