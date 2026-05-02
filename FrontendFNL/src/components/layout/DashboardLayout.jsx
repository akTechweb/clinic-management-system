
import { Outlet } from "react-router-dom";


function DashboardLayout() {
  return (
    <div>

        {/* Main Content */}
        <div
          className="flex-grow-1 p-4 bg-light"
          style={{ minHeight: "100vh" }}
        >
          <Outlet /> {/* THIS FIXES EVERYTHING */}
        </div>
      </div>
  );
}
export default DashboardLayout;