import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, getPatientAppointments, getPatientHistory } from "../services/api";
import Alert from "../components/Alert";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaPlus } from "react-icons/fa";

const STATUS_COLOR = {
  Scheduled: "primary",
  Waiting: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "secondary",
  "In Consultation": "info",
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientRes, apptRes] = await Promise.all([
          getPatient(id),
          getPatientAppointments(id),
        ]);

        if (!cancelled) {
          setPatient(patientRes.data);
          setAppointments(apptRes.data?.results ?? apptRes.data ?? []);
        }

        try {
          const hRes = await getPatientHistory(id);
          if (!cancelled) setHistory(hRes.data?.results ?? (Array.isArray(hRes.data) ? hRes.data : hRes.data ? [hRes.data] : []));
        } catch {
          if (!cancelled) setHistory([]);
        }

      } catch (err) {
        if (!cancelled) {
          const s = err.response?.status;
          setError(
            s === 404 ? "Patient not found. The patient may have been removed." : "Could not load patient profile. Please check your connection."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted mt-4 ms-2">
        <span className="spinner-border spinner-border-sm" />
        <span>Loading patient profile...</span>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} persistent />;
  }

  if (!patient) return null;

  const fullName =
    patient.name ||
    `${patient.first_name || ""} ${patient.last_name || ""}`.trim();

  const initial = fullName?.[0]?.toUpperCase() || "?";

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaUser className="text-primary" size={20} />
          <h4 className="fw-bold mb-0">Patient Profile</h4>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => navigate(`/reception/patients/${id}/update`)}
          >
            <FaEdit className="me-1" />
            Edit
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate("/reception/appointments", {
                state: { patientId: id },
              })
            }
          >
            <FaPlus className="me-1" />
            New Appointment
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 72, height: 72, fontSize: 28 }}
                >
                  {initial}
                </div>

                <h5 className="fw-bold mb-1">{fullName}</h5>

                <span className="badge bg-primary bg-opacity-10 text-primary small">
                  #{patient.patient_id}
                </span>
              </div>

              <ul className="list-unstyled mb-0 small">
                <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                  <FaPhone className="text-success" />
                  <span className="text-muted">Phone</span>
                  <span className="fw-semibold ms-auto">
                    {patient.phone || patient.phone_number || "—"}
                  </span>
                </li>

                {patient.gender && (
                  <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                    <FaUser className="text-muted" />
                    <span className="text-muted">Gender</span>
                    <span className="fw-semibold ms-auto">
                      {patient.gender}
                    </span>
                  </li>
                )}

                {patient.date_of_birth && (
                  <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                    <FaCalendarAlt className="text-muted" />
                    <span className="text-muted">DOB</span>
                    <span className="fw-semibold ms-auto">
                      {patient.date_of_birth}
                    </span>
                  </li>
                )}

                {patient.blood_group && (
                  <li className="d-flex align-items-center gap-2 py-2 border-bottom">
                    <span className="text-danger fw-bold">+</span>
                    <span className="text-muted">Blood</span>
                    <span className="fw-semibold ms-auto">
                      {patient.blood_group}
                    </span>
                  </li>
                )}

                {patient.address && (
                  <li className="d-flex align-items-start gap-2 py-2 border-bottom">
                    <FaMapMarkerAlt className="text-warning mt-1" />
                    <span className="text-muted">Address</span>
                    <span className="fw-semibold ms-auto text-end">
                      {patient.address}
                    </span>
                  </li>
                )}

                <li className="d-flex align-items-center gap-2 py-2">
                  <FaUser className="text-muted" />
                  <span className="text-muted">Status</span>
                  <span
                    className={`badge ms-auto ${
                      patient.is_active ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {patient.is_active ? "Active" : "Inactive"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold py-3">
              Appointment History
            </div>

            {appointments.length === 0 ? (
              <div className="card-body text-center py-5 text-muted small">
                No appointments found for this patient.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.appointment_id}>
                        <td>
                          <span className="badge bg-secondary">
                            #{a.appointment_id}
                          </span>
                        </td>
                        <td>{a.doctor_name || "—"}</td>
                        <td>{a.appointment_date}</td>
                        <td>{a.appointment_time}</td>
                        <td className="text-muted">
                          {a.visit_type || "—"}
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              STATUS_COLOR[a.status] || "secondary"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(
                                `/reception/appointments/${a.appointment_id}`
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-white fw-semibold py-3">
                Consultation History ({history.length})
              </div>
              <div className="card-body p-0">
                <ul className="list-unstyled mb-0">
                  {history.map((h, i) => (
                    <li key={i} className="border-bottom p-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>{h.doctor_name || "Doctor"}</strong>
                        <span className="text-muted">{h.created_at?.split("T")[0] || h.date || "—"}</span>
                      </div>
                      <p className="text-muted mb-0">{h.consultation_note || h.notes || "No notes recorded."}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
