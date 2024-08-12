import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BottomNavigation from "../../components/BottomNavigation";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../contexts/Auth";

function Admin() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && user && !user?.hasTransactionCode) {
      navigate("/transaction-code");
    }
    if (!loading && user && user?.role !== "Admin") {
      navigate("/transaction-code");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="justify-center flex items-center h-screen bg-background ">
        <Loading />
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-b bg-opacity-70 from-background to-blue-800 h-screen overflow-hidden">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="w-full overflow-y-auto pb-32">
          <Outlet />
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

export default Admin;
