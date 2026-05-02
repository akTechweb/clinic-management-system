import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import ReceptionSidebar from "./ReceptionSidebar";
import { useAuth } from "../../../context/AuthContext";

export default function ReceptionLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.username || "Receptionist";

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`d-lg-block ${sidebarOpen ? "d-block" : "d-none"}`}
        style={{ zIndex: 1050, position: sidebarOpen ? "fixed" : "relative", top: 0, left: 0, height: "100vh" }}
      >
        <ReceptionSidebar onLinkClick={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-grow-1 d-flex flex-column overflow-auto">
        <div
          className="d-flex justify-content-between align-items-center px-3 px-md-4 py-3 shadow-sm"
          style={{ background: "linear-gradient(90deg, #0d6efd 0%, #0a58ca 100%)", color: "#fff" }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-white d-lg-none p-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <h6 className="mb-0 fw-semibold d-none d-md-block">City Medical Center — Reception</h6>
            <h6 className="mb-0 fw-semibold d-md-none" style={{ fontSize: "0.85rem" }}>Reception</h6>
          </div>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <span className="d-flex align-items-center gap-2">
              <FaUserCircle size={18} />
              <span style={{ fontSize: "0.9rem" }} className="d-none d-sm-inline">
                Welcome, <strong>{displayName}</strong>
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-light btn-sm d-flex align-items-center gap-1 gap-md-2"
              style={{ fontWeight: 500 }}
            >
              <CiLogout size={18} />
              <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
