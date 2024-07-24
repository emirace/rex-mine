import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <div className="h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Auth;
