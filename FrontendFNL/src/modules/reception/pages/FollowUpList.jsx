import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAppointments } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaHistory, FaSearch } from "react-icons/fa";

const today = () => new Date().toISOString().split("T")[0];

export default function FollowUpList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [date, setDate] = useState(today());

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSearched(false);
    try {
      const res = await searchAppointments({ date, status: "Completed" });
      setAppointments(res.data?.results ?? res.data ?? []);
      setSearched(true);
    } catch {
      setError("Could not search appointments. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaHistory className="text-primary" size={22} />
        <h4 className="fw-bold mb-0">Schedule Follow-Up</h4>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <p className="text-muted mb-3 small">
            Search for a <strong>Completed</strong> appointment to create a follow-up visit.
            Follow-ups must be within 30 days of the original appointment.
          </p>
          <form onSubmit={handleSearch} className="d-flex gap-2 align-items-center">
            <label className="form-label mb-0 fw-semibold small">Date:</label>
            <input type="date" className="form-control" style={{ width: 180 }} value={date}
              onChange={(e) => setDate(e.target.value)} />
            <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
              <FaSearch /> Find Completed
            </button>
          </form>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      {loading && <Loader message="Searching..." />}

      {searched && !loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white fw-semibold py-3">
            Completed Appointments ({appointments.length}) — select one to create follow-up
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
                      <td><span className="badge bg-success">#{a.appointment_id}</span></td>
                      <td>{a.patient_name || a.patient}</td>
                      <td>{a.doctor_name || a.doctor}</td>
                      <td>{a.appointment_date}</td>
                      <td>{a.appointment_time}</td>
                      <td>
                        <button className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/reception/follow-up/${a.appointment_id}`)}>
                          Create Follow-Up
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
