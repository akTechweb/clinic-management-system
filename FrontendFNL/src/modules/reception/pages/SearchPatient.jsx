import { useState, useEffect, useCallback } from "react";
import { searchPatients, deletePatient, getPatientAppointments } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPatient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteHasActive, setDeleteHasActive] = useState(false);
  const [checkingActive, setCheckingActive] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setError("");
    try {
      const res = await searchPatients(q.trim());
      setResults(res.data?.results ?? res.data ?? []);
      setSearched(true);
    } catch {
      setError("Could not search patients. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      doSearch(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      setResults([]); setSearched(false);
    }
  }, [debouncedQuery, doSearch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const openDeleteModal = async (patient) => {
    setDeleteTarget(patient);
    setDeleteHasActive(false);
    setCheckingActive(true);
    try {
      const res = await getPatientAppointments(patient.patient_id);
      const appts = res.data?.results ?? res.data ?? [];
      const active = appts.some((a) => ["Scheduled", "Waiting", "In Consultation"].includes(a.status));
      setDeleteHasActive(active);
    } catch {
      setDeleteHasActive(true);
      setError("Could not verify patient appointments. Please try again or check manually.");
    } finally {
      setCheckingActive(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deletePatient(deleteTarget.patient_id);
      setSuccess(`Patient "${deleteTarget.first_name} ${deleteTarget.last_name}" has been removed successfully.`);
      setResults((prev) => prev.filter((p) => p.patient_id !== deleteTarget.patient_id));
      setDeleteTarget(null);
    } catch (err) {
      setError(parseApiError(err, "Could not remove the patient. Please try again."));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaSearch className="text-primary" size={20} />
        <h4 className="fw-bold mb-0">Search Patient</h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <Alert type="success" message={success} onClose={() => setSuccess("")} />
          <Alert type="error" message={error} onClose={() => setError("")} />
          <form onSubmit={handleSearch} className="d-flex gap-3">
            <div className="flex-grow-1 position-relative">
              <input
                className="form-control"
                placeholder="Search by name, phone, or patient ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading && (
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                  <span className="spinner-border spinner-border-sm text-primary" />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4">
              <FaSearch /> Search
            </button>
          </form>
          <div className="mt-2 text-muted small">
            Results update automatically as you type (minimum 2 characters)
          </div>
        </div>
      </div>

      {searched && !loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white fw-semibold border-bottom py-3">
            Results ({results.length} found)
          </div>
          {results.length === 0 ? (
            <div className="card-body text-center py-5 text-muted">
              <FaUser size={40} className="mb-3 opacity-25" />
              <p className="mb-1">No patients found for "{query}"</p>
              <p className="small text-muted mb-3">Try a different name, phone number, or patient ID</p>
              <button className="btn btn-sm btn-primary" onClick={() => navigate("/reception/patients/register")}>
                Register New Patient
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Blood Group</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((p) => (
                    <tr key={p.patient_id}>
                      <td><span className="badge bg-secondary">#{p.patient_id}</span></td>
                      <td className="fw-semibold">{p.first_name} {p.last_name}</td>
                      <td>{p.date_of_birth}</td>
                      <td><span className="text-capitalize">{p.gender}</span></td>
                      <td>{p.phone_number}</td>
                      <td>{p.blood_group || "—"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" title="View"
                            onClick={() => navigate(`/reception/patients/${p.patient_id}`)}>
                            <FaEye />
                          </button>
                          <button className="btn btn-sm btn-outline-warning" title="Edit"
                            onClick={() => navigate(`/reception/patients/${p.patient_id}/update`)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="Delete"
                            onClick={() => openDeleteModal(p)}>
                            <FaTrash />
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

      <ConfirmModal
        show={!!deleteTarget}
        title={deleteHasActive
          ? "Cannot Delete Patient"
          : "Delete Patient"}
        message={
          checkingActive
            ? "Checking for active appointments..."
            : deleteHasActive
            ? `"${deleteTarget?.first_name} ${deleteTarget?.last_name}" has active appointments (Scheduled, Waiting, or In Consultation). Please cancel or complete those appointments before deleting.`
            : `Are you sure you want to remove "${deleteTarget?.first_name} ${deleteTarget?.last_name}"? This is a soft-delete and can be restored later.`
        }
        confirmText={deleteHasActive ? "OK" : "Delete"}
        cancelText={deleteHasActive ? "Close" : "Cancel"}
        variant="danger"
        loading={deleteLoading || checkingActive}
        onConfirm={deleteHasActive ? () => setDeleteTarget(null) : handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
