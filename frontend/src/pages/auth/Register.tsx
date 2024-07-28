import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { TbUsersGroup } from "react-icons/tb";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
  //@ts-ignore
} from "react-simple-captcha";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/Auth";
import Modal from "../../components/Modal";

const Register: React.FC = () => {
  const { register } = useUser();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [invite, setInvite] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    captcha: "",
    terms: "",
  });

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const validateForm = () => {
    let valid = true;
    let errors = {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      captcha: "",
      terms: "",
    };

    if (!fullName.trim()) {
      errors.fullName = "Full Name is required.";
      valid = false;
    }

    if (!username.trim()) {
      errors.username = "Username is required.";
      valid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    if (validateCaptcha(captchaInput) !== true) {
      errors.captcha = "Invalid CAPTCHA.";
      valid = false;
    }

    if (!agreeToTerms) {
      errors.terms = "You must agree to the terms and conditions.";
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

    await register({ fullName, username, password, invitationCode: invite });
    setLoading(false);
    setShowModal(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="bg-[#1e203b] p-6 md:rounded-lg shadow-lg md:max-w-md h-screen md:h-auto w-full flex flex-col justify-center ">
        <h2 className="text-white text-2xl font-bold mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            icon={FaRegUser}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={error.fullName}
          />
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
          <TextInput
            icon={MdLockOutline}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error.confirmPassword}
          />
          <TextInput
            icon={TbUsersGroup}
            type="text"
            placeholder="Invitation Code (Optional)"
            value={invite} // Change value if needed
            onChange={(e) => setInvite(e.target.value)}
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
          <div className=" mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
            />
            <label htmlFor="terms" className="text-white">
              I agree to the terms & conditions
            </label>
            {error.terms && (
              <div className="text-red-500 text-sm ml-2">{error.terms}</div>
            )}
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            loading={loading}
          >
            Sign Up
          </Button>
        </form>
        <p className="text-center text-white mt-4">
          Already Have An Account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dontShowClose
      >
        <div className="text-white">
          <div className="text-xl font-bold mb-2">
            Account Created Successfully
          </div>
          <div className="">
            You have successfully created your account.{" "}
            <Link className="text-primary" to="/login">
              Login
            </Link>{" "}
            to continue
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
