import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAppointment, cancelAppointment, rescheduleAppointment,
  markNoShow, markAsArrived, getBillByAppointment,
} from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { FaCalendarAlt, FaTimesCircle, FaRedoAlt, FaUserSlash, FaFileInvoiceDollar, FaHistory, FaSignInAlt } from "react-icons/fa";
import { checkResponseError, parseApiError } from "../utils/parseError";

const STATUS_BADGE = {
  Scheduled: "primary",
  Waiting: "warning",
  Completed: "success",
  Cancelled: "danger",
  "No Show": "secondary",
  "In Consultation": "info",
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ appointment_date: "", appointment_time: "" });
  const [rescheduling, setRescheduling] = useState(false);

  const [showNoShow, setShowNoShow] = useState(false);
  const [noShowLoading, setNoShowLoading] = useState(false);
  const [arrivingLoading, setArrivingLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const aRes = await getAppointment(id);
      setAppt(aRes.data);
      try {
        const bRes = await getBillByAppointment(id);
        setBill(bRes.data?.bill_id ? bRes.data : null);
      } catch {
        setBill(null);
      }
    } catch {
      setError("Could not load appointment details. Please check the appointment ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) { setError("Please provide a reason for cancellation."); return; }
    setCancelling(true); setError("");
    try {
      const res = await cancelAppointment(id, cancelReason);
      const errMsg = checkResponseError(res.data);
      if (errMsg) { setError(errMsg); return; }
      setSuccess("Appointment has been cancelled successfully.");
      setShowCancel(false);
      setCancelReason("");
      load();
    } catch (err) {
      setError(parseApiError(err, "Could not cancel the appointment. Please try again."));
    } finally {
      setCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.appointment_date || !rescheduleData.appointment_time) {
      setError("Please select both a new date and time for rescheduling."); return;
    }
    setRescheduling(true); setError("");
    try {
      const res = await rescheduleAppointment(id, rescheduleData.appointment_date, rescheduleData.appointment_time);
      const errMsg = checkResponseError(res.data);
      if (errMsg) { setError(errMsg); return; }
      setSuccess("Appointment has been rescheduled successfully.");
      setShowReschedule(false);
      setRescheduleData({ appointment_date: "", appointment_time: "" });
      load();
    } catch (err) {
      setError(parseApiError(err, "Could not reschedule the appointment. Please try again."));
    } finally {
      setRescheduling(false);
    }
  };

  const handleMarkArrived = async () => {
    setArrivingLoading(true);
    setError("");
    setSuccess("");
    try {
      await markAsArrived(id);
      setAppt((prev) => prev ? { ...prev, status: "Waiting" } : prev);
      setSuccess("Patient marked as arrived — now in the waiting queue.");
    } catch (err) {
      console.log("Mark as arrived error:", err);
      setError(parseApiError(err, "Could not mark as arrived. Please try again."));
    } finally {
      setArrivingLoading(false);
    }
  };

  const handleNoShow = async () => {
    setNoShowLoading(true); setError("");
    try {
      const res = await markNoShow(id);
      const errMsg = checkResponseError(res.data);
      if (errMsg) { setError(errMsg); setShowNoShow(false); return; }
      setSuccess("Appointment marked as No Show.");
      setShowNoShow(false);
      load();
    } catch (err) {
      setError(parseApiError(err, "Could not mark as No Show. Please try again."));
      setShowNoShow(false);
    } finally {
      setNoShowLoading(false);
    }
  };

  if (loading) return <Loader message="Loading appointment..." />;

  const isEditable = appt && ["Scheduled", "Waiting"].includes(appt.status);
  const isCompletedOrInConsultation = appt && ["Completed", "In Consultation"].includes(appt.status);
  const followUps = appt?.follow_ups ?? [];
  const consultationHistory = appt?.consultation_history || appt?.history || null;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-primary" size={22} />
          <h4 className="fw-bold mb-0">Appointment Detail</h4>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>Back</button>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      {appt && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white fw-semibold py-3 d-flex align-items-center justify-content-between">
                <span>Appointment Info</span>
                <span className={`badge bg-${STATUS_BADGE[appt.status] || "secondary"}`}>
                  {appt.status}
                </span>
              </div>
              <div className="card-body">
                <table className="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr><th>Appt ID</th><td>#{appt.appointment_id}</td></tr>
                    <tr><th>Patient</th>
                      <td>
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => navigate(`/reception/patients/${appt.patient_id || appt.patient}`)}
                        >
                          {appt.patient_name || appt.patient}
                        </span>
                      </td>
                    </tr>
                    <tr><th>Doctor</th><td>{appt.doctor_name || appt.doctor}</td></tr>
                    <tr><th>Date</th><td>{appt.appointment_date}</td></tr>
                    <tr><th>Time</th><td>{appt.appointment_time}</td></tr>
                    <tr><th>Visit Type</th><td>{appt.visit_type || "—"}</td></tr>
                    {appt.token_number && <tr><th>Token</th><td><span className="badge bg-dark">#{appt.token_number}</span></td></tr>}
                    {appt.is_emergency && <tr><th>Emergency</th><td><span className="badge bg-danger">Yes</span></td></tr>}
                    {appt.cancellation_reason && (
                      <tr><th>Cancel Reason</th><td className="text-danger">{appt.cancellation_reason}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            {isEditable && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-semibold py-3">Actions</div>
                <div className="card-body d-flex flex-wrap gap-2">
                  {appt.status === "Scheduled" && (
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center gap-1"
                      disabled={arrivingLoading}
                      onClick={handleMarkArrived}
                    >
                      {arrivingLoading ? (
                        <><span className="spinner-border spinner-border-sm" /> Processing...</>
                      ) : (
                        <><FaSignInAlt /> Mark as Arrived</>
                      )}
                    </button>
                  )}
                  <button className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                    onClick={() => { setShowReschedule(!showReschedule); setShowCancel(false); }}
                    disabled={isCompletedOrInConsultation}>
                    <FaRedoAlt /> Reschedule
                  </button>
                  <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => { setShowCancel(!showCancel); setShowReschedule(false); }}>
                    <FaTimesCircle /> Cancel
                  </button>
                  <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setShowNoShow(true)}>
                    <FaUserSlash /> No Show
                  </button>
                </div>

                {showCancel && (
                  <div className="card-body border-top pt-3">
                    <label className="form-label fw-semibold small">
                      Reason for Cancellation <span className="text-danger">*</span>
                    </label>
                    <textarea className="form-control form-control-sm mb-2" rows={2}
                      value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please provide a reason..." />
                    <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
                      {cancelling ? "Cancelling..." : "Confirm Cancel"}
                    </button>
                  </div>
                )}

                {showReschedule && (
                  <div className="card-body border-top pt-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">New Date</label>
                        <input type="date" className="form-control form-control-sm"
                          min={new Date().toISOString().split("T")[0]}
                          value={rescheduleData.appointment_date}
                          onChange={(e) => setRescheduleData({ ...rescheduleData, appointment_date: e.target.value })} />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">New Time</label>
                        <input type="time" className="form-control form-control-sm"
                          value={rescheduleData.appointment_time}
                          onChange={(e) => setRescheduleData({ ...rescheduleData, appointment_time: e.target.value })} />
                      </div>
                    </div>
                    <button className="btn btn-warning btn-sm mt-2" onClick={handleReschedule} disabled={rescheduling}>
                      {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {consultationHistory && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-semibold py-3 d-flex align-items-center gap-2">
                  <FaHistory className="text-info" /> Consultation Notes
                </div>
                <div className="card-body small">
                  <p className="mb-1">{consultationHistory.consultation_note || consultationHistory.notes || "No notes recorded."}</p>
                  {consultationHistory.created_at && (
                    <p className="text-muted mb-0">Date: {consultationHistory.created_at.split("T")[0]}</p>
                  )}
                </div>
              </div>
            )}

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold py-3 d-flex align-items-center gap-2">
                <FaFileInvoiceDollar className="text-success" /> Billing
              </div>
              <div className="card-body">
                {bill ? (
                  <div>
                    <p className="mb-1 small"><strong>Bill ID:</strong> #{bill.bill_id}</p>
                    <p className="mb-1 small"><strong>Amount:</strong> ₹{bill.total_amount}</p>
                    <p className="mb-1 small"><strong>Status:</strong>
                      <span className={`ms-1 badge ${bill.payment_status === "Paid" ? "bg-success" : "bg-warning text-dark"}`}>
                        {bill.payment_status}
                      </span>
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      {bill.payment_status !== "Paid" && (
                        <button className="btn btn-success btn-sm"
                          onClick={() => navigate(`/reception/payment/${appt.appointment_id}`)}>
                          Pay Now
                        </button>
                      )}
                      <button className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/reception/billing/${appt.appointment_id}`)}>
                        View Bill
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted small mb-2">No bill created yet.</p>
                    {appt.status === "Completed" && (
                      <button className="btn btn-success btn-sm"
                        onClick={() => navigate(`/reception/billing/${appt.appointment_id}`)}>
                        Create Bill
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold py-3 d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center gap-2">
                  <FaHistory /> Follow-Ups ({followUps.length})
                </span>
                {appt.status === "Completed" && (
                  <button className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/reception/follow-up/${appt.appointment_id}`)}>
                    + Add
                  </button>
                )}
              </div>
              <div className="card-body">
                {followUps.length === 0 ? (
                  <p className="text-muted small mb-0">No follow-ups recorded.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {followUps.map((f, i) => (
                      <li key={f.appointment_id || i} className="border-bottom py-2 small d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Date:</strong> {f.appointment_date || f.date} &nbsp;|&nbsp;
                          <strong>Time:</strong> {f.appointment_time || f.time} &nbsp;|&nbsp;
                          <strong>Status:</strong> <span className={`badge bg-${STATUS_BADGE[f.status] || "secondary"} ms-1`}>{f.status}</span>
                        </div>
                        {f.appointment_id && (
                          <button className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/reception/appointments/${f.appointment_id}`)}>
                            View
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showNoShow}
        title="Mark as No Show"
        message={`Are you sure you want to mark appointment #${appt?.appointment_id} as No Show? This action cannot be undone.`}
        confirmText="Mark No Show"
        cancelText="Cancel"
        variant="warning"
        loading={noShowLoading}
        onConfirm={handleNoShow}
        onCancel={() => setShowNoShow(false)}
      />
    </div>
  );
}
