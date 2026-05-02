import { useState, useEffect } from "react";
import { createWalkIn, getDoctors } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { FaWalking } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const INITIAL = {
  first_name: "",
  last_name: "",
  phone_number: "",
  gender: "",
  date_of_birth: "",
  blood_group: "",
  address: "",
  doctor: "",
};

export default function WalkIn() {
  const [form, setForm] = useState(INITIAL);
  const [doctors, setDoctors] = useState([]);
  const [doctorsError, setDoctorsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    getDoctors()
      .then((res) => setDoctors(res.data?.results ?? res.data ?? []))
      .catch((err) => {
        const status = err.response?.status;
        setDoctorsError(
          status === 403
            ? "Doctor list unavailable for this account. Enter Doctor ID manually."
            : "Could not load doctors. Enter Doctor ID manually."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim()) { setError("First name is required."); return; }
    if (!/^\d{10}$/.test(form.phone_number.trim())) {
      setError("Phone number must be exactly 10 digits."); return;
    }
    if (!form.gender) { setError("Please select a gender."); return; }
    if (!form.doctor) { setError("Please select a doctor."); return; }

    setSaving(true); setSuccess(""); setError(""); setResult(null);
    try {
      const res = await createWalkIn({
        ...form,
        phone_number: form.phone_number.trim(),
      });
      if (res.data?.patient_id) {
        setResult(res.data);
        setSuccess(`Walk-in patient "${form.first_name.trim()}" registered and appointment created!`);
        setForm(INITIAL);
      } else {
        setError(parseApiError({ data: res.data }, "Walk-in registration failed. Please check the details."));
      }
    } catch (err) {
      setError(parseApiError(err, "Walk-in registration failed. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaWalking className="text-warning" size={22} />
        <h4 className="fw-bold mb-0">Walk-In Registration</h4>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold py-3">Patient Details</div>
            <div className="card-body p-4">
              <Alert type="success" message={success} onClose={() => setSuccess("")} />
              <Alert type="error" message={error} onClose={() => setError("")} />

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                    <input name="first_name" className="form-control" value={form.first_name}
                      onChange={handleChange} required minLength={2} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input name="last_name" className="form-control" value={form.last_name}
                      onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                    <input name="phone_number" className="form-control" value={form.phone_number}
                      onChange={handleChange} required maxLength={10} placeholder="10-digit number" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <input type="date" name="date_of_birth" className="form-control"
                      value={form.date_of_birth} onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Gender <span className="text-danger">*</span></label>
                    <select name="gender" className="form-select" value={form.gender}
                      onChange={handleChange} required>
                      <option value="">--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Blood Group</label>
                    <select name="blood_group" className="form-select" value={form.blood_group}
                      onChange={handleChange}>
                      <option value="">Unknown</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Doctor <span className="text-danger">*</span></label>
                    {doctors.length > 0 ? (
                      <select name="doctor" className="form-select" value={form.doctor}
                        onChange={handleChange} required>
                        <option value="">-- Select --</option>
                        {doctors.map((d) => (
                          <option key={d.doctor_id ?? d.id} value={d.doctor_id ?? d.id}>
                            {d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim()}
                            {(d.specialization || d.department_name || d.department) ? ` — ${d.specialization || d.department_name || d.department}` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        {doctorsError && (
                          <Alert type="warning" message={doctorsError} />
                        )}
                        <input
                          type="number"
                          name="doctor"
                          className="form-control"
                          placeholder="Doctor ID"
                          value={form.doctor}
                          onChange={handleChange}
                          required
                          min="1"
                        />
                      </>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea name="address" className="form-control" rows={2}
                      value={form.address} onChange={handleChange}
                      placeholder="Full address" />
                  </div>
                </div>

                <Alert type="info" message="Walk-in appointment time is auto-assigned immediately by the system." />

                <button type="submit" className="btn btn-warning mt-3 px-4 fw-semibold" disabled={saving}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Registering...</>
                    : "Register Walk-In"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {result && (
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm border-success border-start border-4">
              <div className="card-body p-4 text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center text-white mb-3"
                    style={{ width: 70, height: 70, fontSize: 28 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h5 className="fw-bold text-success">Walk-In Registered!</h5>
                  <p className="text-muted small mb-0">Please share the token number with the patient</p>
                </div>
                <div className="bg-light rounded p-3 mb-3">
                  <p className="mb-1 small text-muted">Token Number</p>
                  <h2 className="fw-bold text-primary mb-0">#{result.token || result.token_number}</h2>
                </div>
                <table className="table table-sm table-borderless text-start mb-0">
                  <tbody>
                    <tr><th className="small">Patient ID</th><td className="small">#{result.patient_id}</td></tr>
                    <tr><th className="small">Appointment ID</th><td className="small">#{result.appointment_id}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
