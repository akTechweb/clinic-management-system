import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillByAppointment, payBill } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaMoneyBillWave } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

const METHODS = ["Cash", "Card", "UPI"];

export default function Payment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    getBillByAppointment(appointmentId)
      .then((res) => {
        if (res.data?.bill_id) setBill(res.data);
        else setError("No bill found for this appointment. Please create a bill first.");
      })
      .catch(() => setError("Could not load bill data. Please check the appointment ID."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bill?.payment_status === "Paid") { setError("This bill has already been paid."); return; }
    setSaving(true); setError("");
    try {
      const res = await payBill(bill.bill_id, paymentMethod);
      if (res.data?.bill_id || res.data?.payment_status === "Paid") {
        setSuccess(`Payment of ₹${bill.total_amount} recorded successfully via ${paymentMethod}!`);
        setBill((b) => ({ ...b, payment_status: "Paid", payment_method: paymentMethod }));
      } else {
        setError(parseApiError({ data: res.data }, "Payment could not be processed. Please try again."));
      }
    } catch (err) {
      setError(parseApiError(err, "Payment could not be processed. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading payment details..." />;

  const alreadyPaid = bill?.payment_status === "Paid";

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaMoneyBillWave className="text-success" size={22} />
        <h4 className="fw-bold mb-0">Payment</h4>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      <div className="row g-4" style={{ maxWidth: 800 }}>
        <div className="col-md-5">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold py-3">Bill Summary</div>
            <div className="card-body">
              {bill && (
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr><th>Bill ID</th><td>#{bill.bill_id}</td></tr>
                    <tr><th>Appointment</th><td>#{bill.appointment}</td></tr>
                    <tr><th>Patient</th><td>{bill.patient_name}</td></tr>
                    <tr><th>Doctor</th><td>{bill.doctor_name}</td></tr>
                    <tr><th>Consultation</th><td>₹{bill.consultation_fee}</td></tr>
                    {parseFloat(bill.lab_cost) > 0 && (
                      <tr><th>Lab Cost</th><td>₹{bill.lab_cost}</td></tr>
                    )}
                    {parseFloat(bill.pharmacy_cost) > 0 && (
                      <tr><th>Pharmacy</th><td>₹{bill.pharmacy_cost}</td></tr>
                    )}
                    {parseFloat(bill.discount) > 0 && (
                      <tr><th>Discount</th><td className="text-danger">-₹{bill.discount}</td></tr>
                    )}
                    <tr><th>Total</th><td className="fw-bold text-success">₹{bill.total_amount}</td></tr>
                    <tr><th>Status</th><td>
                      <span className={`badge ${alreadyPaid ? "bg-success" : "bg-warning text-dark"}`}>
                        {bill.payment_status}
                      </span>
                    </td></tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-7">
          {alreadyPaid ? (
            <div className="card border-0 shadow-sm border-success border-start border-4">
              <div className="card-body p-4 text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center text-white mb-3"
                    style={{ width: 70, height: 70, fontSize: 28 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h5 className="fw-bold text-success">Payment Complete!</h5>
                  <p className="text-muted small mb-0">Transaction processed successfully</p>
                </div>
                <table className="table table-sm table-borderless text-start">
                  <tbody>
                    <tr><th>Amount Paid</th><td>₹{bill.total_amount}</td></tr>
                    <tr><th>Method</th><td>{bill.payment_method || "—"}</td></tr>
                    {bill.paid_at && <tr><th>Date</th><td>{bill.paid_at.split("T")[0]}</td></tr>}
                  </tbody>
                </table>
                <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => window.print()}>
                  Print Receipt
                </button>
                <div className="mt-3">
                  <button className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/reception/appointments/${appointmentId}`)}>
                    Back to Appointment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold py-3">Record Payment</div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Payment Method <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {METHODS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={`btn ${paymentMethod === m ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => setPaymentMethod(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="alert alert-light border mb-4">
                    <strong>Amount Due: ₹{bill?.total_amount}</strong>
                  </div>
                  <button type="submit" className="btn btn-success px-4" disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                      : `Confirm Payment — ₹${bill?.total_amount}`}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
