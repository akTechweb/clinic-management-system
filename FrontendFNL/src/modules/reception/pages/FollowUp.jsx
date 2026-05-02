import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointment, createFollowUp } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaHistory } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

export default function FollowUp() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ appointment_date: "", appointment_time: "" });

  useEffect(() => {
    getAppointment(appointmentId)
      .then((res) => setAppt(res.data))
      .catch(() => setError("Could not load appointment details."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const getMinDate = () => {
    if (!appt?.appointment_date) return new Date().toISOString().split("T")[0];
    const d = new Date(appt.appointment_date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    if (!appt?.appointment_date) return "";
    const d = new Date(appt.appointment_date);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointment_date) { setError("Please select a follow-up date."); return; }
    if (!form.appointment_time) { setError("Please select a follow-up time."); return; }

    if (appt?.appointment_date) {
      const followUpDate = new Date(form.appointment_date);
      const apptDate = new Date(appt.appointment_date);
      const diffDays = (followUpDate - apptDate) / (1000 * 60 * 60 * 24);
      if (diffDays < 1) { setError("Follow-up date must be after the original appointment date."); return; }
      if (diffDays > 30) { setError("Follow-up must be scheduled within 30 days of the original appointment."); return; }
    }

    setSaving(true); setError("");
    try {
      const res = await createFollowUp({
        parent_appointment: appointmentId,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
      });
      if (res.data?.appointment_id) {
        setSuccess(`Follow-up appointment #${res.data.appointment_id} scheduled successfully! Redirecting...`);
        setTimeout(() => navigate(`/reception/appointments/${appointmentId}`), 2000);
      } else {
        setError(parseApiError({ data: res.data }, "Could not create follow-up. Please check the details."));
      }
    } catch (err) {
      setError(parseApiError(err, "Could not create follow-up. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaHistory className="text-primary" size={22} />
        <h4 className="fw-bold mb-0">Schedule Follow-Up</h4>
      </div>

      <div className="card border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          {appt && (
            <Alert type="info" message={`Original Appointment #${appt.appointment_id} — ${appt.patient_name || appt.patient} with ${appt.doctor_name || appt.doctor} on ${appt.appointment_date}. Follow-up must be within 30 days.`} persistent />
          )}

          <Alert type="success" message={success} onClose={() => setSuccess("")} />
          <Alert type="error" message={error} onClose={() => setError("")} />

          {appt?.status !== "Completed" && (
            <Alert type="warning" message={`Follow-ups can only be created for Completed appointments. Current status: ${appt?.status}`} persistent />
          )}

          {appt?.status === "Completed" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Follow-Up Date <span className="text-danger">*</span>
                </label>
                <input type="date" className="form-control"
                  value={form.appointment_date}
                  min={getMinDate()}
                  max={getMaxDate()}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  required />
                <div className="form-text text-muted">
                  Between {getMinDate()} and {getMaxDate()} (within 30 days of original)
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Follow-Up Time <span className="text-danger">*</span>
                </label>
                <input type="time" className="form-control"
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                  required />
              </div>
              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Scheduling...</>
                    : "Schedule Follow-Up"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
