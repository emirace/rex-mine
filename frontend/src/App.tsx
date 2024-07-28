import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import { useUser } from "./contexts/Auth";

function App() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && !user?.hasTransactionCode) {
      navigate("/transaction-code");
    }
  }, [user]);
  console.log(user);
  if (loading) {
    return <div>Loading...</div>;
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
