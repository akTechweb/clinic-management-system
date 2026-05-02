import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchAppointments } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaFileInvoiceDollar } from "react-icons/fa";

const today = () => new Date().toISOString().split("T")[0];

export default function BillingList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(today());

  const load = async (d) => {
    setLoading(true); setError("");
    try {
      const res = await searchAppointments({ date: d, status: "Completed" });
      setAppointments(res.data?.results ?? res.data ?? []);
    } catch {
      setError("Could not load completed appointments. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(date); }, [date]);

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaFileInvoiceDollar className="text-success" size={22} />
        <h4 className="fw-bold mb-0">Billing</h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 d-flex align-items-center gap-3">
          <label className="form-label mb-0 fw-semibold">Date:</label>
          <input type="date" className="form-control" style={{ width: 180 }} value={date}
            onChange={(e) => setDate(e.target.value)} />
          <span className="text-muted small">Showing completed appointments eligible for billing</span>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />

      {loading ? <Loader message="Loading..." /> : (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white fw-semibold py-3">
            Completed Appointments ({appointments.length}) — click to manage billing
          </div>
          {appointments.length === 0 ? (
            <div className="card-body text-center py-5 text-muted">
              No completed appointments found for {date}.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.appointment_id}>
                      <td><span className="badge bg-dark">#{a.appointment_id}</span></td>
                      <td>{a.patient_name || a.patient}</td>
                      <td>{a.doctor_name || a.doctor}</td>
                      <td>{a.appointment_date}</td>
                      <td>{a.appointment_time}</td>
                      <td>
                        <button className="btn btn-sm btn-success"
                          onClick={() => navigate(`/reception/billing/${a.appointment_id}`)}>
                          Manage Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
