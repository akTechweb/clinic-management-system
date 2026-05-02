import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AddStaffPage({
  formData,
  handleChange,
  handleSubmit,
  departments = [],
  isEdit = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const roles = [
    "Admin",
    "Doctor",
    "Labtechnician",
    "Pharmacist",
    "Receptionist",
  ];
  

  return (
    <div className="container mt-5">
      <h2>{isEdit ? "Edit Staff" : "Add Staff"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="username"
          placeholder="Username"
          value={formData.username || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />
          

        <div className="position-relative mb-2">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={formData.password || ""}
    onChange={handleChange}
    className="form-control pe-5"
  />

  {/* 👁 Eye Icon */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent text-secondary"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
          <input
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* ❌ removed email + password */}

        <select
          name="department"
          value={formData.department || ""}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.dept_id} value={d.dept_id}>
              {d.dept_name}
            </option>
          ))}
        </select>

        <select
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <select
          name="blood_group"
          value={formData.blood_group || ""}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <select
          name="status"
          value={formData.status || "active"}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="btn btn-primary w-100">
          {isEdit ? "Edit" : "Add"}
        </button>
      </form>
    </div>
  );
}