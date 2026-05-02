import { useState, useEffect } from "react";
import { searchAppointments, getDoctors, markAsArrived } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaFilter, FaSignInAlt } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

const STATUS_BADGE = {
  Scheduled: "primary",
  Waiting: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "secondary",
  "In Consultation": "info",
};

const today = () => new Date().toISOString().split("T")[0];

export default function AppointmentSearch() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [arrivingId, setArrivingId] = useState(null);
  const [filters, setFilters] = useState({ date: today(), status: "", doctor: "" });

  useEffect(() => {
    getDoctors()
      .then((res) => setDoctors(res.data?.results ?? res.data ?? []))
      .catch(() => {});
  }, []);

  const fetchAppointments = async (f) => {
    setLoading(true); setError("");
    try {
      const params = {};
      if (f.date) params.date = f.date;
      if (f.status) params.status = f.status;
      if (f.doctor) params.doctor = f.doctor;
      const res = await searchAppointments(params);
      setAppointments(res.data?.results ?? res.data ?? []);
    } catch {
      setError("Could not load appointments. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(filters); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAppointments(filters);
  };

  const handleMarkArrived = async (appointmentId) => {
    setArrivingId(appointmentId);
    setError("");
    setSuccess("");
    try {
      await markAsArrived(appointmentId);
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointment_id === appointmentId ? { ...a, status: "Waiting" } : a
        )
      );
      setSuccess(`Appointment #${appointmentId} marked as arrived — patient is now in the queue.`);
    } catch (err) {
      console.log("Mark as arrived error:", err);
      setError(parseApiError(err, "Could not mark appointment as arrived. Please try again."));
    } finally {
      setArrivingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaCalendarCheck className="text-primary" size={22} />
        <h4 className="fw-bold mb-0">Appointments</h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleFilter} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-semibold mb-1">Date</label>
              <input type="date" className="form-control form-control-sm" value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold mb-1">Status</label>
              <select className="form-select form-select-sm" value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Waiting">Waiting</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
                <option value="In Consultation">In Consultation</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold mb-1">Doctor</label>
              <select className="form-select form-select-sm" value={filters.doctor}
                onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}>
                <option value="">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.doctor_id ?? d.id} value={d.doctor_id ?? d.id}>
                    {d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim()}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1">
                <FaFilter /> Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? <Loader message="Loading appointments..." /> : (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white fw-semibold py-3 d-flex justify-content-between align-items-center">
            <span>Results ({appointments.length})</span>
            <button className="btn btn-sm btn-primary" onClick={() => navigate("/reception/appointments")}>
              + New Appointment
            </button>
          </div>
          {appointments.length === 0 ? (
            <div className="card-body text-center py-5 text-muted">
              No appointments found for the selected filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.appointment_id}>
                      <td><span className="badge bg-dark">#{a.appointment_id}</span></td>
                      <td>{a.patient_name || a.patient}</td>
                      <td>{a.doctor_name || a.doctor}</td>
                      <td>{a.appointment_date}</td>
                      <td>{a.appointment_time}</td>
                      <td><span className="text-muted small">{a.visit_type || "—"}</span></td>
                      <td>
                        <span className={`badge bg-${STATUS_BADGE[a.status] || "secondary"}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {a.status === "Scheduled" && (
                            <button
                              className="btn btn-sm btn-success d-flex align-items-center gap-1"
                              disabled={arrivingId === a.appointment_id}
                              onClick={() => handleMarkArrived(a.appointment_id)}
                            >
                              {arrivingId === a.appointment_id ? (
                                <><span className="spinner-border spinner-border-sm" /> Processing...</>
                              ) : (
                                <><FaSignInAlt /> Arrived</>
                              )}
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/reception/appointments/${a.appointment_id}`)}>
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
