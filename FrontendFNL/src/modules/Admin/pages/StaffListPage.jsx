import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStaff, deleteStaff } from "../api/adminApi";

export default function StaffListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    loadStaff();
  }, [location]);

  const loadStaff = async () => {
    const data = await getStaff();
    setStaff(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      await deleteStaff(id);
      loadStaff();
    }
  };

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between mb-3">
        <h2>Staff List</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/staff/add")}
        >
          + Add Staff
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s, index) => (
            <tr key={s.staff_id}>
              <td>{index + 1}</td>
              <td>{s.user_first_name} {s.user_last_name}</td>
              <td>{s.role_name}</td>
              <td>{s.department_name}</td>
              <td>{s.phone_number}</td>
              <td>{s.status}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    navigate(`/admin/staff/edit/${s.staff_id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(s.staff_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}