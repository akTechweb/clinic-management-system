import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import {
  FaCalendarAlt, FaCheckCircle, FaClock, FaRupeeSign,
  FaUserPlus, FaWalking, FaChartLine, FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const today = () => new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export default function ReceptionDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const res = await getDashboardStats();
      setStats(res.data);
      setLastRefresh(new Date().toLocaleTimeString("en-IN"));
    } catch {
      setError("Could not load dashboard statistics. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const cards = stats
    ? [
        { label: "Total Appointments", value: stats.total_appointments ?? 0, color: "primary", icon: <FaCalendarAlt size={28} /> },
        { label: "Completed", value: stats.completed ?? 0, color: "success", icon: <FaCheckCircle size={28} /> },
        { label: "Pending / Scheduled", value: stats.pending ?? 0, color: "warning", icon: <FaClock size={28} /> },
        { label: "Revenue Collected", value: `₹${stats.revenue ?? stats.revenue_collected ?? 0}`, color: "info", icon: <FaRupeeSign size={28} /> },
      ]
    : [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-0">Reception Dashboard</h4>
          <span className="text-muted small">{today()}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          {lastRefresh && <span className="text-muted small d-none d-md-inline">Updated: {lastRefresh}</span>}
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
          >
            <FaSyncAlt className={refreshing ? "spin-animation" : ""} size={14} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => { setError(""); fetchStats(); }} />

      {loading ? (
        <Loader message="Loading dashboard..." />
      ) : (
        <>
          <div className="row g-3 g-md-4 mb-4">
            {cards.map((c) => (
              <div className="col-6 col-lg-3" key={c.label}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex justify-content-between align-items-center p-3 p-md-4">
                    <div>
                      <p className="text-muted small mb-1">{c.label}</p>
                      <h3 className={`fw-bold text-${c.color} mb-0`}>{c.value}</h3>
                    </div>
                    <div className={`text-${c.color} opacity-75 d-none d-sm-block`}>{c.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold border-bottom py-3">
              Quick Actions
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 gap-md-3">
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => navigate("/reception/patients/register")}>
                  <FaUserPlus /> Register Patient
                </button>
                <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => navigate("/reception/appointments")}>
                  <FaCalendarAlt /> New Appointment
                </button>
                <button className="btn btn-warning d-flex align-items-center gap-2" onClick={() => navigate("/reception/walk-in")}>
                  <FaWalking /> Walk-In
                </button>
                <button className="btn btn-info text-white d-flex align-items-center gap-2" onClick={() => navigate("/reception/appointments/search")}>
                  <FaChartLine /> View Appointments
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
