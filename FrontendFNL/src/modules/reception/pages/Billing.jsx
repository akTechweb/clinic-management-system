import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointment, getBillByAppointment, createBill, getBillPDFUrl, downloadBillPDF } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaFileInvoiceDollar, FaDownload } from "react-icons/fa";
import { parseApiError } from "../utils/parseError";

export default function Billing() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [existingBill, setExistingBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pharmacyCost, setPharmacyCost] = useState("0");
  const [labCost, setLabCost] = useState("0");
  const [discount, setDiscount] = useState("0");

  useEffect(() => {
    const load = async () => {
      try {
        const aRes = await getAppointment(appointmentId);
        setAppt(aRes.data);
      } catch {
        setError("Could not load appointment details. Please check the appointment ID.");
        setLoading(false);
        return;
      }

      try {
        const bRes = await getBillByAppointment(appointmentId);
        if (bRes.data?.bill_id) setExistingBill(bRes.data);
      } catch {
        setExistingBill(null);
      }

      setLoading(false);
    };
    load();
  }, [appointmentId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (existingBill) { setError("A bill already exists for this appointment."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        appointment: appointmentId,
        pharmacy_cost: parseFloat(pharmacyCost) || 0,
        lab_cost: parseFloat(labCost) || 0,
        discount: parseFloat(discount) || 0,
      };
      const res = await createBill(payload);
      if (res.data?.bill_id) {
        setSuccess(`Bill #${res.data.bill_id} created successfully! Total: ₹${res.data.total_amount}`);
        setExistingBill(res.data);
      } else {
        setError(parseApiError({ data: res.data }, "Could not create the bill. Please check the details."));
      }
    } catch (err) {
      setError(parseApiError(err, "Could not create the bill. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await downloadBillPDF(existingBill.bill_id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `bill_${existingBill.bill_id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      const pdfUrl = getBillPDFUrl(existingBill.bill_id);
      window.open(pdfUrl, "_blank");
    }
  };

  if (loading) return <Loader message="Loading billing..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaFileInvoiceDollar className="text-success" size={22} />
          <h4 className="fw-bold mb-0">Billing</h4>
        </div>
        {existingBill && (
          <button
            onClick={handleDownloadPDF}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <FaDownload /> Download PDF
          </button>
        )}
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      {appt && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold py-3">Appointment Summary</div>
              <div className="card-body">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr><th>Appt ID</th><td>#{appt.appointment_id}</td></tr>
                    <tr><th>Patient</th><td>{appt.patient_name || appt.patient}</td></tr>
                    <tr><th>Doctor</th><td>{appt.doctor_name || appt.doctor}</td></tr>
                    <tr><th>Date</th><td>{appt.appointment_date}</td></tr>
                    <tr><th>Status</th><td>
                      <span className={`badge ${appt.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}>
                        {appt.status}
                      </span>
                    </td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {existingBill ? (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white fw-semibold py-3">
                  Bill #{existingBill.bill_id} —{" "}
                  {existingBill.payment_status === "Paid" ? "PAID" : "UNPAID"}
                </div>
                <div className="card-body p-4">
                  <h5 className="text-center fw-bold mb-1">City Medical Center</h5>
                  <p className="text-center text-muted small mb-4">Official Receipt</p>

                  <table className="table table-bordered mb-4">
                    <thead className="table-light">
                      <tr><th>Item</th><th className="text-end">Amount (₹)</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Consultation Fee</td><td className="text-end">₹{existingBill.consultation_fee}</td></tr>
                      {parseFloat(existingBill.lab_cost) > 0 && (
                        <tr><td>Lab Cost</td><td className="text-end">₹{existingBill.lab_cost}</td></tr>
                      )}
                      {parseFloat(existingBill.pharmacy_cost) > 0 && (
                        <tr><td>Pharmacy</td><td className="text-end">₹{existingBill.pharmacy_cost}</td></tr>
                      )}
                      {parseFloat(existingBill.discount) > 0 && (
                        <tr className="text-danger"><td>Discount</td><td className="text-end">-₹{existingBill.discount}</td></tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="table-dark fw-bold">
                        <td>Total</td><td className="text-end">₹{existingBill.total_amount}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {existingBill.payment_method && (
                    <p className="text-muted small">Payment Method: {existingBill.payment_method}</p>
                  )}

                  {existingBill.payment_status !== "Paid" ? (
                    <div className="text-end">
                      <button className="btn btn-success"
                        onClick={() => navigate(`/reception/payment/${appointmentId}`)}>
                        Proceed to Payment
                      </button>
                    </div>
                  ) : (
                    <Alert type="success" message="Payment received. Thank you!" persistent />
                  )}
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-semibold py-3">Create Bill</div>
                <div className="card-body p-4">
                  {appt.status !== "Completed" && (
                    <Alert type="warning" message={`Billing is typically created after the appointment is marked Completed. Current status: ${appt.status}`} persistent />
                  )}
                  <form onSubmit={handleCreate}>
                    <Alert type="info" message="Consultation fee is automatically set from the doctor's rate." persistent />
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Lab Cost (₹)</label>
                      <input type="number" min="0" step="0.01" className="form-control"
                        value={labCost}
                        onChange={(e) => setLabCost(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Pharmacy Cost (₹)</label>
                      <input type="number" min="0" step="0.01" className="form-control"
                        value={pharmacyCost}
                        onChange={(e) => setPharmacyCost(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Discount (₹)</label>
                      <input type="number" min="0" step="0.01" className="form-control"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-success px-4" disabled={saving}>
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                        : "Create Bill"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
