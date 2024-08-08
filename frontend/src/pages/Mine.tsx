import { useEffect, useState } from "react";

import MineList from "../components/mine/MineList";
import MineStatus from "../components/mine/MineStatus";

function Mine() {
  const [tab, setTab] = useState("List");

  useEffect(() => {
    // Parse the query parameters from the current URL
    const searchParams = new URLSearchParams(window.location.search);

    // Check if the 'status' query parameter is 'true'
    if (searchParams.get("status") === "true") {
      setTab("Status");
    }
  }, []);

  return (
    <div className="max-w-2xl p-6   ">
      <div className="flex items-center text-white font-medium min-h-14 mb-4 border border-white rounded-full p-2 ">
        <div
          onClick={() => setTab("List")}
          className={`flex-1 text-center transition-all ${
            tab === "List" && "bg-primary p-2 rounded-full "
          }`}
        >
          Mine List
        </div>
        <div
          onClick={() => setTab("Status")}
          className={`flex-1 text-center transition-all ${
            tab === "Status" && "bg-primary p-2 rounded-full "
          }`}
        >
          Mine Status
        </div>
      </div>
      {tab === "List" && <MineList />}
      {tab === "Status" && <MineStatus />}
    </div>
  );
}

export default Mine;
