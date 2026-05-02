import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments, deleteDepartment } from "../api/adminApi";

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  // 🔹 Load departments
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data.filter((d) => d.status === "active"));
    } catch (err) {
      console.error(err);
    }
  };

   // 🔥 ADD DELETE FUNCTION HERE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDepartment(id);
        alert("Deleted successfully");
        loadDepartments(); // refresh table
      } catch (err) {
        console.error(err);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="container mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Department List</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/departments/add")}
        >
          + Add Department
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <tr key={dept.dept_id}>
                <td>{index + 1}</td>
                <td>{dept.dept_code}</td>
                <td>{dept.dept_name}</td>
                <td>{dept.status}</td>

                <td>
                  {/* ✏️ EDIT */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/admin/departments/edit/${dept.dept_id}`)
                    }
                  >
                    Edit
                  </button>

                  {/* 🗑 DELETE */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(dept.dept_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No departments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}