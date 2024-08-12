import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TransactionCode from "./pages/auth/TransactionCode";
import Home from "./pages/Home";
import Mine from "./pages/Mine";
import Profile from "./pages/Profile";
import Invite from "./pages/Invite";
import Deposit from "./pages/Deposit";
import WithdrawalRequest from "./pages/WithdrawalRequest";
import Auth from "./pages/auth";
import Layout from "./pages";
import Admin from "./pages/admin";
import Users from "./pages/admin/Users";
import Withdrawal from "./pages/admin/Withdrawal";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import WithdrawalRequestDetail from "./pages/admin/WithdrawalRequestDetail";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "invite", element: <Invite /> },
      { path: "mine", element: <Mine /> },
      { path: "profile", element: <Profile /> },
      { path: "deposit", element: <Deposit /> },
      { path: "Withdrawal", element: <WithdrawalRequest /> },
    ],
  },

  {
    path: "/",
    element: <Auth />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/transaction-code", element: <TransactionCode /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "users", element: <Users /> },
      { path: "withdrawals", element: <Withdrawal /> },
      { path: "withdrawals/:id", element: <WithdrawalRequestDetail /> },
      { path: "users/:userId", element: <AdminUserDetail /> },
    ],
  },
]);

export default router;
