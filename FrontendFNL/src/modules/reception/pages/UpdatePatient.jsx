import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaEdit } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

export default function UpdatePatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone_number: "", address: "" });
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPatient(id)
      .then((res) => {
        setPatient(res.data);
        setForm({
          phone_number: res.data.phone || res.data.phone_number || "",
          address: res.data.address || "",
        });
      })
      .catch(() => setError("Could not load patient details. Please check the patient ID."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone_number.trim()) { setError("Phone number is required."); return; }
    if (!/^\d{10}$/.test(form.phone_number.trim())) { setError("Phone number must be exactly 10 digits."); return; }
    setSaving(true); setSuccess(""); setError("");
    try {
      await updatePatient(id, { phone_number: form.phone_number.trim(), address: form.address.trim() });
      setSuccess("Patient details updated successfully! Redirecting...");
      setTimeout(() => navigate(`/reception/patients/${id}`), 2000);
    } catch (err) {
      setError(parseApiError(err, "Could not update patient. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading patient..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaEdit className="text-warning" size={22} />
        <h4 className="fw-bold mb-0">Update Patient</h4>
      </div>

      <div className="card border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          {patient && (
            <Alert type="info"
              message={`Editing: ${patient.name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim()} (ID #${patient.patient_id}). Only phone and address can be updated.`}
              persistent
            />
          )}

          <Alert type="success" message={success} onClose={() => setSuccess("")} />
          <Alert type="error" message={error} onClose={() => setError("")} />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
              <input
                className="form-control"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
                maxLength={10}
                placeholder="10-digit phone number"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Address</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-warning px-4 fw-semibold" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "Save Changes"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/reception/patients/${id}`)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
