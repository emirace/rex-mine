import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";
import { useUser } from "../../contexts/Auth";
import Loading from "../../components/Loading";

function Auth() {
  const { loading, user } = useUser();

  if (loading && !user) {
    return (
      <div className="justify-center flex items-center h-screen bg-background ">
        <Loading />
      </div>
    );
  }
  return (
    <div className="h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Auth;
