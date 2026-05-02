
import {
  FaTachometerAlt,
  FaHospital,
  FaUserNurse,
  FaUserMd,
  FaUsers,
  FaUserCircle,
  FaBuilding,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Clinic Admin
        </h2>

        <ul className="space-y-4 text-base">
          <li className="flex items-center gap-4 p-3 rounded-xl bg-white/20 cursor-pointer">
            <FaTachometerAlt size={20} />
            Dashboard
          </li>

          <li
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/20 cursor-pointer"
            onClick={() => navigate("/admin/departments")}
          >
            <FaHospital size={20} />
            Departments
          </li>

          <li
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/20 cursor-pointer"
            onClick={() => navigate("/admin/staff")}
          >
            <FaUserNurse size={20} />
            Staff
          </li>

          <li
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/20 cursor-pointer"
            onClick={() => navigate("/admin/doctors")}
          >
            <FaUserMd size={20} />
            Doctors
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        {/* NAVBAR */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
          <h2 className="text-xl font-semibold">
            Clinic Admin Portal
          </h2>

          <div className="flex items-center gap-2">
              <FaUserCircle />
              <span>Welcome, Admin</span>
            </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-gray-100 transition"
          >
            <CiLogout size={20} />
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-between">
              <div>
                <p>Total Doctors</p>
                <h2 className="text-3xl font-bold text-blue-600">2</h2>
              </div>
              <FaUserMd size={30} className="text-blue-600" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-between">
              <div>
                <p>Total Staff</p>
                <h2 className="text-3xl font-bold text-green-600">5</h2>
              </div>
              <FaUsers size={30} className="text-green-600" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg flex justify-between">
              <div>
                <p>Total Departments</p>
                <h2 className="text-3xl font-bold text-purple-600">8</h2>
              </div>
              <FaBuilding size={30} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


  