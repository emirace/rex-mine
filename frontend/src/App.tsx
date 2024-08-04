import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import { useUser } from "./contexts/Auth";
import Loading from "./components/Loading";

function App() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user", loading, user, !loading && !user);
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && user && !user?.hasTransactionCode) {
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
    <div className="bg-background h-screen overflow-hidden">
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

export default App;
