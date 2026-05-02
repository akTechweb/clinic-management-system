import { useState, useEffect, useCallback, useRef } from "react";
import { getDoctors, getDoctorAvailability } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaUserMd, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const today = () => new Date().toISOString().split("T")[0];

export default function DoctorAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [doctorsError, setDoctorsError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState(today());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const fetchRef = useRef(0);

  useEffect(() => {
    getDoctors()
      .then((res) => {
        const list = res.data?.results ?? res.data ?? [];
        setDoctors(list);
      })
      .catch((err) => {
        const status = err.response?.status;
        console.log("Doctor list error:", err);
        setDoctorsError(
          status === 403
            ? "Doctor list unavailable. Enter a Doctor ID manually."
            : "Could not load doctors. Enter a Doctor ID manually."
        );
      })
      .finally(() => setDoctorsLoading(false));
  }, []);

  const fetchAvailability = useCallback(async (doctorId, selectedDate) => {
    if (!doctorId || !selectedDate) return;

    const dateStr = selectedDate.length === 10 ? selectedDate : new Date(selectedDate).toISOString().split("T")[0];

    const callId = ++fetchRef.current;
    setLoading(true);
    setError("");
    setChecked(false);
    setSelectedSlot(null);

    try {
      const res = await getDoctorAvailability(doctorId, dateStr);
      if (callId !== fetchRef.current) return;
      setAvailableSlots(res.data?.available_slots ?? []);
      setBookedSlots(res.data?.booked_slots ?? []);
      setChecked(true);
    } catch (err) {
      if (callId !== fetchRef.current) return;
      console.log("Availability fetch error:", err);
      setError("Could not fetch availability. Please try again.");
      setAvailableSlots([]);
      setBookedSlots([]);
      setChecked(true);
    } finally {
      if (callId === fetchRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDoctor && date) {
      fetchAvailability(selectedDoctor, date);
    } else {
      setChecked(false);
      setAvailableSlots([]);
      setBookedSlots([]);
    }
  }, [selectedDoctor, date, fetchAvailability]);

  const selectedDoctorObj = doctors.find((d) => String(d.doctor_id ?? d.id) === String(selectedDoctor));
  const totalSlots = availableSlots.length + bookedSlots.length;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaUserMd className="text-primary" size={22} />
        <h4 className="fw-bold mb-0">Doctor Availability</h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <Alert type="error" message={error} onClose={() => setError("")} />

          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold">Select Doctor <span className="text-danger">*</span></label>
              {doctorsLoading ? (
                <div className="form-control bg-light text-muted">Loading doctors...</div>
              ) : doctors.length > 0 ? (
                <select className="form-select" value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}>
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
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    min="1"
                  />
                </>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Date <span className="text-danger">*</span></label>
              <input type="date" className="form-control" value={date}
                min={today()}
                onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="col-md-3">
              {!selectedDoctor && !loading && (
                <Alert type="warning" message="Select a doctor to view availability" persistent />
              )}
              {selectedDoctor && loading && (
                <div className="d-flex align-items-center gap-2 text-muted small py-2">
                  <span className="spinner-border spinner-border-sm" />
                  Checking...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && !checked && <Loader message="Checking availability..." />}

      {checked && !loading && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center p-3">
                <p className="text-muted small mb-1">Available Slots</p>
                <h3 className="fw-bold text-success mb-0">{availableSlots.length}</h3>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center p-3">
                <p className="text-muted small mb-1">Booked Slots</p>
                <h3 className="fw-bold text-danger mb-0">{bookedSlots.length}</h3>
              </div>
            </div>
            <div className="col-4">
              <div className="card border-0 shadow-sm text-center p-3">
                <p className="text-muted small mb-1">Total</p>
                <h3 className="fw-bold text-primary mb-0">{totalSlots}</h3>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold py-3">
              {selectedDoctorObj
                ? `Dr. ${selectedDoctorObj.name || `${selectedDoctorObj.first_name || ""} ${selectedDoctorObj.last_name || ""}`.trim()} — ${date}`
                : `Availability — ${date}`}
            </div>
            {totalSlots === 0 ? (
              <div className="card-body text-center py-5 text-muted">
                <FaUserMd size={40} className="mb-3 opacity-25" />
                <p className="mb-1">No availability data returned from the server.</p>
                <p className="small text-muted mb-0">The doctor may not have a schedule set for this date.</p>
              </div>
            ) : (
              <div className="card-body">
                {availableSlots.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-success fw-semibold mb-3">
                      <FaCheckCircle className="me-1" /> Available ({availableSlots.length})
                    </h6>
                    <div className="row g-2">
                      {availableSlots.map((slot, i) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <div key={i} className="col-6 col-md-4 col-lg-3">
                            <div
                              className={`rounded p-3 text-center border-2 transition-all ${
                                isSelected
                                  ? "border-primary bg-primary bg-opacity-10 shadow"
                                  : "border-success bg-success bg-opacity-10"
                              }`}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                border: isSelected ? "2px solid #0d6efd" : "2px solid #198754",
                              }}
                              onClick={() => setSelectedSlot(isSelected ? null : slot)}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(25,135,84,0.2)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = isSelected ? "0 2px 8px rgba(13,110,253,0.15)" : "none";
                              }}
                            >
                              <FaCheckCircle className={isSelected ? "text-primary mb-1" : "text-success mb-1"} size={20} />
                              <div className="fw-bold" style={{ fontSize: "0.95rem" }}>{slot}</div>
                              <div className={`small fw-semibold ${isSelected ? "text-primary" : "text-success"}`}>
                                {isSelected ? "Selected" : "Free"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {bookedSlots.length > 0 && (
                  <div>
                    <h6 className="text-danger fw-semibold mb-3">
                      <FaTimesCircle className="me-1" /> Booked ({bookedSlots.length})
                    </h6>
                    <div className="row g-2">
                      {bookedSlots.map((slot, i) => (
                        <div key={i} className="col-6 col-md-4 col-lg-3">
                          <div
                            className="rounded p-3 text-center bg-danger bg-opacity-10"
                            style={{
                              border: "2px solid #dc3545",
                              opacity: 0.7,
                              cursor: "not-allowed",
                            }}
                          >
                            <FaTimesCircle className="text-danger mb-1" size={20} />
                            <div className="fw-bold text-muted" style={{ fontSize: "0.95rem", textDecoration: "line-through" }}>{slot}</div>
                            <div className="small text-danger fw-semibold">Booked</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
