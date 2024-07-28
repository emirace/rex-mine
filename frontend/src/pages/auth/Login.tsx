import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
  //@ts-ignore
} from "react-simple-captcha";
import { useUser } from "../../contexts/Auth";

const Login: React.FC = () => {
  const { login, loading: loadingUser, user } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    username: "",
    password: "",
    captcha: "",
  });

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  useEffect(() => {
    if (!loadingUser && user) {
      navigate("/");
    }
  }, [user]);

  const validateForm = () => {
    let valid = true;
    let errors = {
      username: "",
      password: "",
      captcha: "",
    };

    if (!username.trim()) {
      errors.username = "Username is required.";
      valid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
      valid = false;
    }

    if (validateCaptcha(captchaInput) !== true) {
      errors.captcha = "Invalid CAPTCHA.";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    await login({ username, password });
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-full bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="bg-[#1e203b] p-6 md:rounded-lg shadow-lg md:max-w-md h-screen md:h-auto w-full flex flex-col justify-center">
        <h2 className="text-white text-2xl font-bold mb-6">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            icon={FaRegUser}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={error.username}
          />
          <TextInput
            icon={MdLockOutline}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password}
          />
          <div className="flex gap-5 items-center pb-6">
            <TextInput
              placeholder="Enter CAPTCHA"
              type="text"
              onChange={(e) => setCaptchaInput(e.target.value)}
              value={captchaInput}
              error={error.captcha}
            />
            <LoadCanvasTemplate />
          </div>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            loading={loading}
          >
            Sign In
          </Button>
        </form>
        <p className="text-center text-white mt-4">
          Don't Have An Account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
