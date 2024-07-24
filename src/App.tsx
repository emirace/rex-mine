import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import { useAuth } from "./contexts/Auth";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

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
