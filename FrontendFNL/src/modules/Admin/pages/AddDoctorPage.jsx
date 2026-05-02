// import React from "react";
// import AddDoctor from "../components/AddDoctor";

// const AddDoctorPage = () => {
//   const {
//     form,
//     departments,
//     errors,
//     handleChange,
//     handleSubmit,
//   } = AddDoctor();

//   return (
//     <div className="container mt-4">
//       <div className="card p-4 shadow">
//         <h3>Add Doctor</h3>

//         <form onSubmit={handleSubmit}>
//           <input
//             name="phone_number"
//             placeholder="Phone"
//             className="form-control mb-1"
//             onChange={handleChange}
//           />
//           <small className="text-danger">{errors.phone_number}</small>

//           <input
//             name="consultation_fee"
//             type="number"
//             placeholder="Fee"
//             className="form-control mb-1"
//             onChange={handleChange}
//           />
//           <small className="text-danger">{errors.consultation_fee}</small>

//           <input
//             name="experience_years"
//             type="number"
//             placeholder="Experience"
//             className="form-control mb-1"
//             onChange={handleChange}
//           />
//           <small className="text-danger">{errors.experience_years}</small>

//           <input
//             name="date_of_birth"
//             type="date"
//             className="form-control mb-1"
//             onChange={handleChange}
//           />
//           <small className="text-danger">{errors.date_of_birth}</small>

//           <select
//             name="department"
//             className="form-control mb-2"
//             onChange={handleChange}
//           >
//             <option value="">Select Department</option>
//             {departments.map((d) => (
//               <option key={d.dept_id} value={d.dept_id}>
//                 {d.dept_name}
//               </option>
//             ))}
//           </select>
//           <small className="text-danger">{errors.department}</small>

//           <button className="btn btn-success mt-2">
//             Add Doctor
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddDoctorPage;


export default function AddDoctorPage({
  formData,
  handleChange,
  handleSubmit,
  departments = [],
  isEdit = false,
}) {
  return (
    <div className="container mt-5">
      <h2>{isEdit ? "Edit Doctor" : "Add Doctor"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="user"
          type="number"
          placeholder="User ID (must exist)"
          value={formData.user || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

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

        <input
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="license_number"
          placeholder="License Number"
          value={formData.license_number || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="experience_years"
          type="number"
          placeholder="Experience"
          value={formData.experience_years || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          name="consultation_fee"
          type="number"
          placeholder="Consultation Fee"
          value={formData.consultation_fee || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

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