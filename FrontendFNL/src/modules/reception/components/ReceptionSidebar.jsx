import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaSearch,
  FaCalendarAlt,
  FaCalendarCheck,
  FaWalking,
  FaFileInvoiceDollar,
  FaUserMd,
  FaListOl,
  FaHistory,
} from "react-icons/fa";

const links = [
  { to: "/reception/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/reception/patients/register", label: "Register Patient", icon: <FaUserPlus /> },
  { to: "/reception/patients/search", label: "Search Patient", icon: <FaSearch /> },
  { to: "/reception/appointments", label: "New Appointment", icon: <FaCalendarAlt /> },
  { to: "/reception/appointments/search", label: "Appointments", icon: <FaCalendarCheck /> },
  { to: "/reception/walk-in", label: "Walk-In", icon: <FaWalking /> },
  { to: "/reception/doctor-availability", label: "Doctor Availability", icon: <FaUserMd /> },
  { to: "/reception/doctor-queue", label: "Doctor Queue", icon: <FaListOl /> },
  { to: "/reception/billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
  { to: "/reception/follow-up-list", label: "Follow-Up", icon: <FaHistory /> },
];

export default function ReceptionSidebar({ onLinkClick }) {
  return (
    <div
      className="d-flex flex-column text-white shadow-lg"
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0d6efd 0%, #0a4dbf 100%)",
        flexShrink: 0,
      }}
    >
      <div className="p-4 border-bottom border-white border-opacity-25">
        <h5 className="fw-bold mb-0" style={{ letterSpacing: "0.5px" }}>
          🏥 Reception
        </h5>
        <small className="opacity-75">Clinic Management</small>
      </div>
      <nav className="flex-grow-1 p-2 pt-3">
        <ul className="list-unstyled mb-0">
          {links.map(({ to, label, icon }) => (
            <li key={to} className="mb-1">
              <NavLink
                to={to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded text-white text-decoration-none fw-medium transition-all ${
                    isActive ? "bg-white bg-opacity-25" : "hover-bg"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                  fontSize: "0.9rem",
                })}
              >
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-top border-white border-opacity-25">
        <small className="opacity-50">v1.0 · Reception Module</small>
      </div>
    </div>
  );
}
