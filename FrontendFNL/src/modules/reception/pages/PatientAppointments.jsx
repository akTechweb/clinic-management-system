import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, getPatientAppointments, markAsArrived } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

const STATUS_BADGE = {
  Scheduled: "primary",
  Waiting: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "secondary",
  "In Consultation": "info",
};

export default function PatientAppointments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [arrivingId, setArrivingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, aRes] = await Promise.all([getPatient(id), getPatientAppointments(id)]);
        setPatient(pRes.data);
        setAppointments(aRes.data?.results ?? aRes.data ?? []);
      } catch {
        setError("Could not load patient appointments. Please check the patient ID and try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  if (loading) return <Loader message="Loading appointments..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-primary" size={22} />
          <h4 className="fw-bold mb-0">
            Appointments — {patient ? (patient.name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || `#${id}`) : `#${id}`}
          </h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/reception/patients/${id}`)}>
            Patient Profile
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/reception/appointments", { state: { patientId: id } })}>
            + New Appointment
          </button>
        </div>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-semibold py-3">
          All Appointments ({appointments.length})
        </div>
        {appointments.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            No appointments found for this patient.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th><th>Doctor</th><th>Date</th><th>Time</th>
                  <th>Type</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <td><span className="badge bg-dark">#{a.appointment_id}</span></td>
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
    </div>
  );
}
