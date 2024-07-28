import React, { useState } from "react";
import { IconType } from "react-icons";
import { VscEyeClosed, VscEye } from "react-icons/vsc";

interface InputProps {
  icon?: IconType;
  type: string;
  placeholder: string;
  value?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<InputProps> = ({
  icon: Icon,
  type,
  placeholder,
  value,
  error,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div>
      <label className="flex items-center bg-[#2b2e4a] rounded-full px-6 py-4 relative">
        {Icon && <Icon className="text-white mr-3" />}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent outline-none w-full text-white placeholder-gray-400"
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-white"
          >
            {showPassword ? <VscEyeClosed /> : <VscEye />}
          </button>
        )}
      </label>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default TextInput;
