import React, { useState, useEffect, useCallback, useRef } from "react";
import { getDoctors, getDoctorQueue, completeConsultation } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { FaListOl, FaUserMd, FaCheckCircle, FaSyncAlt, FaNotesMedical } from "react-icons/fa";
import { parseApiError, checkResponseError } from "../utils/parseError";

const REFRESH_INTERVAL = 5000;

function sortQueue(list) {
  return [...list].sort((a, b) => {
    if (a.is_emergency && !b.is_emergency) return -1;
    if (!a.is_emergency && b.is_emergency) return 1;
    return (a.token_number || 0) - (b.token_number || 0);
  });
}

function extractDoctors(queueList, existingDoctors) {
  const map = new Map();
  existingDoctors.forEach((d) => {
    const label = d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim();
    if (label) map.set(label, d);
  });
  queueList.forEach((q) => {
    const label = q.doctor_name || "Unknown Doctor";
    if (!map.has(label)) {
      map.set(label, {
        doctor_id: q.doctor_id ?? q.doctor,
        name: label,
      });
    }
  });
  return Array.from(map.values());
}

function groupByDoctor(list) {
  const groups = {};
  list.forEach((q) => {
    const key = q.doctor_name || q.doctor || "Unknown Doctor";
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  });
  return groups;
}

function getDoctorLabel(d) {
  return d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim() || "Unknown";
}

function getDoctorSpec(d) {
  return d.specialization || d.department_name || d.department || "";
}

export default function DoctorQueue() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [queue, setQueue] = useState([]);
  const [allQueue, setAllQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);

  const [completeId, setCompleteId] = useState(null);
  const [note, setNote] = useState("");
  const [completing, setCompleting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const intervalRef = useRef(null);
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  const fetchQueue = useCallback(async (showLoader = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (showLoader) setLoading(true);
    try {
      const res = await getDoctorQueue();
      if (!isMounted.current) return;
      const queueList = res.data?.results ?? res.data ?? [];
      const sorted = sortQueue(queueList);
      setAllQueue(sorted);
      setDoctors((prev) => extractDoctors(sorted, prev));
      setLastRefresh(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      if (!isMounted.current) return;
      console.log("Queue fetch error:", err);
      if (showLoader) setError("Could not load today's queue. Please try refreshing.");
    } finally {
      fetchingRef.current = false;
      if (isMounted.current && showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      setLoading(true);
      try {
        const [dResult, qResult] = await Promise.allSettled([getDoctors(), getDoctorQueue()]);

        if (!isMounted.current) return;

        let apiDoctors = [];
        if (dResult.status === "fulfilled") {
          apiDoctors = dResult.value.data?.results ?? dResult.value.data ?? [];
        }

        if (qResult.status === "fulfilled") {
          const queueList = qResult.value.data?.results ?? qResult.value.data ?? [];
          const sorted = sortQueue(queueList);
          setAllQueue(sorted);
          setDoctors(extractDoctors(sorted, apiDoctors));
          setLastRefresh(new Date().toLocaleTimeString("en-IN"));
        } else {
          setDoctors(apiDoctors);
          setError("Could not load today's queue. Please try refreshing.");
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    init();

    intervalRef.current = setInterval(() => {
      if (isMounted.current) fetchQueue(false);
    }, REFRESH_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
    };
  }, [fetchQueue]);

  useEffect(() => {
    if (!selectedDoctor) {
      setQueue(allQueue);
    } else {
      setQueue(allQueue.filter((q) => {
        const qName = q.doctor_name || "";
        return qName === selectedDoctor;
      }));
    }
  }, [selectedDoctor, allQueue]);

  const handleRefresh = () => {
    setError("");
    setSuccess("");
    fetchQueue(true);
  };

  const openCompleteModal = (appointmentId) => {
    setCompleteId(appointmentId);
    setNote("");
    setShowCompleteModal(true);
  };

  const closeCompleteModal = () => {
    setShowCompleteModal(false);
    setCompleteId(null);
    setNote("");
  };

  const handleComplete = async () => {
    if (!completeId) return;
    setCompleting(true);
    setError("");
    setSuccess("");
    try {
      const consultationNote = note.trim() || "Consultation completed";
      const res = await completeConsultation(completeId, consultationNote);
      const errMsg = checkResponseError(res.data);
      if (errMsg) { setError(errMsg); closeCompleteModal(); return; }
      setAllQueue((prev) => prev.filter((q) => q.appointment_id !== completeId));
      setSuccess(`Consultation for appointment #${completeId} completed successfully.`);
      closeCompleteModal();
    } catch (err) {
      console.log("Complete consultation error:", err);
      setError(parseApiError(err, "Could not complete the consultation. Please try again."));
      closeCompleteModal();
    } finally {
      setCompleting(false);
    }
  };

  const grouped = groupByDoctor(queue);
  const doctorNames = Object.keys(grouped).sort();
  const emergencyCount = queue.filter((q) => q.is_emergency).length;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaListOl className="text-primary" size={22} />
          <h4 className="fw-bold mb-0">Doctor Queue — Today</h4>
        </div>
        <div className="d-flex align-items-center gap-2">
          {lastRefresh && <span className="text-muted small d-none d-md-inline">Updated: {lastRefresh}</span>}
          <span className="badge bg-info text-white small">Auto-refresh: 5s</span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <p className="text-muted small mb-1">Total in Queue</p>
            <h3 className="fw-bold text-primary mb-0">{queue.length}</h3>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <p className="text-muted small mb-1">Doctors Active</p>
            <h3 className="fw-bold text-success mb-0">{doctorNames.length}</h3>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <p className="text-muted small mb-1">Emergencies</p>
            <h3 className={`fw-bold mb-0 ${emergencyCount > 0 ? "text-danger" : "text-muted"}`}>{emergencyCount}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-5">
              <label className="form-label small fw-semibold mb-1">Filter by Doctor</label>
              <select className="form-select" value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option value="">All Doctors ({allQueue.length})</option>
                {doctors.map((d) => {
                  const label = getDoctorLabel(d);
                  const count = allQueue.filter((q) => (q.doctor_name || "") === label).length;
                  return (
                    <option key={label} value={label}>
                      {label}{getDoctorSpec(d) ? ` — ${getDoctorSpec(d)}` : ""} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleRefresh} disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : <><FaSyncAlt size={14} /> Refresh Now</>}
              </button>
            </div>
            <div className="col-md-4">
              <Alert type="info" message="Queue auto-refreshes every 5 seconds" persistent />
            </div>
          </div>
        </div>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? <Loader message="Loading queue..." /> : queue.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 text-muted">
            <FaListOl size={40} className="mb-3 opacity-25" />
            <p className="mb-1 fw-semibold">No patients in queue</p>
            <p className="small text-muted mb-0">The queue will auto-refresh when new patients arrive.</p>
          </div>
        </div>
      ) : (
        doctorNames.map((doctorName) => {
          const patients = grouped[doctorName];
          return (
            <div key={doctorName} className="card border-0 shadow-sm mb-4">
              <div className="card-header py-3 d-flex align-items-center justify-content-between"
                style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36 }}>
                    <FaUserMd className="text-primary" />
                  </div>
                  <div>
                    <span className="fw-bold">{doctorName}</span>
                    {patients[0]?.visit_type && (
                      <span className="text-muted small d-block">{patients[0]?.department_name || ""}</span>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {patients.some((p) => p.is_emergency) && (
                    <span className="badge bg-danger">
                      {patients.filter((p) => p.is_emergency).length} Emergency
                    </span>
                  )}
                  <span className="badge bg-primary">{patients.length} patient{patients.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 70 }}>Pos</th>
                      <th style={{ width: 90 }}>Token</th>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th style={{ width: 100 }}>Emergency</th>
                      <th style={{ width: 120 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((q, index) => (
                      <tr
                        key={q.appointment_id}
                        style={{
                          background: q.is_emergency ? "rgba(220, 53, 69, 0.08)" : "transparent",
                          borderLeft: q.is_emergency ? "4px solid #dc3545" : "4px solid transparent",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = q.is_emergency
                            ? "rgba(220, 53, 69, 0.15)"
                            : "rgba(13, 110, 253, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = q.is_emergency
                            ? "rgba(220, 53, 69, 0.08)"
                            : "transparent";
                        }}
                      >
                        <td>
                          <span className={`badge ${index === 0 ? "bg-warning text-dark" : "bg-light text-dark border"}`}
                            style={{ fontSize: "1rem", minWidth: 32 }}>
                            {index + 1}
                          </span>
                        </td>
                        <td><span className="badge bg-dark fs-6">#{q.token_number}</span></td>
                        <td className="fw-semibold">{q.patient_name}</td>
                        <td>{q.appointment_time}</td>
                        <td><span className="text-muted small">{q.visit_type || "—"}</span></td>
                        <td>
                          {q.is_emergency
                            ? <span className="badge bg-danger px-3 py-1">Emergency</span>
                            : <span className="text-muted small">—</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                            onClick={() => openCompleteModal(q.appointment_id)}
                          >
                            <FaCheckCircle /> Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {showCompleteModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}>
                    <FaNotesMedical className="text-success" size={18} />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Complete Consultation</h5>
                    <span className="text-muted small">Appointment #{completeId}</span>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={closeCompleteModal} disabled={completing} />
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold small">
                  Consultation Notes <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter consultation notes... (defaults to 'Consultation completed' if left empty)"
                  autoFocus
                />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary" onClick={closeCompleteModal} disabled={completing}>
                  Cancel
                </button>
                <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleComplete} disabled={completing}>
                  {completing ? (
                    <><span className="spinner-border spinner-border-sm" /> Saving...</>
                  ) : (
                    <><FaCheckCircle /> Complete Consultation</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
