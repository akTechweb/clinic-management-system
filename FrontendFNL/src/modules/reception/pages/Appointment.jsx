import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointment, getDoctors, searchPatients } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { FaCalendarPlus, FaSearch } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

const VISIT_TYPES = ["New", "Follow-Up"];

export default function Appointment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [doctorsError, setDoctorsError] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(
    location.state?.patientId ? { patient_id: location.state.patientId } : null
  );
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient: location.state?.patientId || "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    visit_type: "New",
  });

  useEffect(() => {
    getDoctors()
      .then((res) => {
        const list = res.data?.results ?? res.data ?? [];
        if (list.length === 0) {
          setDoctorsError("No doctors found. Please enter a doctor ID manually.");
        }
        setDoctors(list);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 403) {
          setDoctorsError("Doctor list requires additional permissions. Please enter a doctor ID manually.");
        } else if (status === 404) {
          setDoctorsError("Doctor list endpoint not found. Please enter a doctor ID manually.");
        } else {
          setDoctorsError("Could not load doctor list. Please enter a doctor ID manually.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePatientSearch = async () => {
    if (!patientSearch.trim()) return;
    setSearching(true);
    try {
      const res = await searchPatients(patientSearch);
      setPatientResults(res.data?.results ?? res.data ?? []);
    } catch {
      setError("Could not search patients. Please check your connection.");
    } finally {
      setSearching(false);
    }
  };

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setForm({ ...form, patient: p.patient_id });
    setPatientResults([]);
    setPatientSearch(`${p.first_name} ${p.last_name} — ${p.phone_number}`);
  };

  const validateTimeNotPast = () => {
    if (!form.appointment_date || !form.appointment_time) return true;
    const todayStr = new Date().toISOString().split("T")[0];
    if (form.appointment_date !== todayStr) return true;
    const now = new Date();
    const [h, m] = form.appointment_time.split(":").map(Number);
    if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient) { setError("Please select a patient first."); return; }
    if (!form.doctor) { setError("Please select a doctor."); return; }
    if (!form.appointment_date) { setError("Please choose a date for the appointment."); return; }
    if (!form.appointment_time) { setError("Please choose a time for the appointment."); return; }
    if (!validateTimeNotPast()) {
      setError("Cannot book an appointment in the past. Please select a future time."); return;
    }
    setSaving(true); setSuccess(""); setError("");
    try {
      const res = await createAppointment(form);
      if (res.data?.appointment_id) {
        setSuccess(`Appointment #${res.data.appointment_id} created successfully! Redirecting...`);
        setTimeout(() => navigate(`/reception/appointments/${res.data.appointment_id}`), 2000);
      } else {
        setError(parseApiError({ data: res.data }, "Failed to create appointment. Please check the details."));
      }
    } catch (err) {
      setError(parseApiError(err, "Failed to create appointment. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaCalendarPlus className="text-primary" size={22} />
        <h4 className="fw-bold mb-0">Create Appointment</h4>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <Alert type="success" message={success} onClose={() => setSuccess("")} />
          <Alert type="error" message={error} onClose={() => setError("")} />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Search Patient <span className="text-danger">*</span></label>
              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Type name or phone..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    if (!e.target.value) { setSelectedPatient(null); setForm({ ...form, patient: "" }); }
                  }}
                />
                <button type="button" className="btn btn-outline-primary" onClick={handlePatientSearch} disabled={searching}>
                  {searching ? <span className="spinner-border spinner-border-sm" /> : <FaSearch />}
                </button>
              </div>
              {patientResults.length > 0 && (
                <div className="border rounded mt-1 bg-white shadow-sm"
                  style={{ maxHeight: 200, overflowY: "auto", position: "relative", zIndex: 10 }}>
                  {patientResults.map((p) => (
                    <div key={p.patient_id} className="px-3 py-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => selectPatient(p)}>
                      <strong>{p.first_name} {p.last_name}</strong> — {p.phone_number}
                      <span className="text-muted ms-2 small">#{p.patient_id}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedPatient && (
                <div className="mt-2 small text-success fw-semibold">
                  Patient selected: #{selectedPatient.patient_id}
                </div>
              )}
              <div className="mt-2">
                <small className="text-muted">New patient? </small>
                <button type="button" className="btn btn-link btn-sm p-0"
                  onClick={() => navigate("/reception/patients/register")}>
                  Register now
                </button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor <span className="text-danger">*</span></label>
                {doctors.length > 0 ? (
                  <select className="form-select" value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.doctor_id ?? d.id} value={d.doctor_id ?? d.id}>
                        {d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim()}
                        {(d.specialization || d.department_name || d.department) ? ` — ${d.specialization || d.department_name || d.department}` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    {doctorsError && <Alert type="warning" message={doctorsError} />}
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Doctor ID"
                      value={form.doctor}
                      onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                      min="1"
                    />
                  </>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Visit Type <span className="text-danger">*</span></label>
                <select className="form-select" value={form.visit_type}
                  onChange={(e) => setForm({ ...form, visit_type: e.target.value })}>
                  {VISIT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Date <span className="text-danger">*</span></label>
                <input type="date" className="form-control" value={form.appointment_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Time <span className="text-danger">*</span></label>
                <input type="time" className="form-control" value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} required />
                {form.appointment_date === new Date().toISOString().split("T")[0] && form.appointment_time && !validateTimeNotPast() && (
                  <div className="form-text text-danger small">This time has already passed today.</div>
                )}
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : "Create Appointment"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
