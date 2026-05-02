// import { useEffect, useState } from "react";
// import {
//   getDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
// } from "../api/adminApi";

// export default function DoctorPage() {
//   const [doctors, setDoctors] = useState([]);

//   const [form, setForm] = useState({
//     user: "",
//     department: "",
//     date_of_birth: "",
//     qualification: "",
//     experience_years: "",
//     license_number: "",
//     consultation_fee: "",
//     phone_number: "",
//   });

//   const [editId, setEditId] = useState(null);

//   const fetchDoctors = async () => {
//     const res = await getDoctors();
//     setDoctors(res.data);
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       await updateDoctor(editId, form);
//       setEditId(null);
//     } else {
//       await createDoctor(form);
//     }

//     setForm({
//       user: "",
//       department: "",
//       date_of_birth: "",
//       qualification: "",
//       experience_years: "",
//       license_number: "",
//       consultation_fee: "",
//       phone_number: "",
//     });

//     fetchDoctors();
//   };

//   const handleEdit = (doc) => {
//     setForm({
//       user: doc.user,
//       department: doc.department,
//       date_of_birth: doc.date_of_birth,
//       qualification: doc.qualification,
//       experience_years: doc.experience_years,
//       license_number: doc.license_number,
//       consultation_fee: doc.consultation_fee,
//       phone_number: doc.phone_number,
//     });

//     setEditId(doc.doctor_id); // ✅ IMPORTANT
//   };

//   const handleDelete = async (id) => {
//     await deleteDoctor(id);
//     fetchDoctors();
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Doctor Management</h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit}>
//         <input name="user" placeholder="User ID" value={form.user} onChange={handleChange} className="form-control mb-2" />
//         <input name="department" placeholder="Department ID" value={form.department} onChange={handleChange} className="form-control mb-2" />
//         <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="form-control mb-2" />
//         <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} className="form-control mb-2" />
//         <input name="experience_years" placeholder="Experience" value={form.experience_years} onChange={handleChange} className="form-control mb-2" />
//         <input name="license_number" placeholder="License" value={form.license_number} onChange={handleChange} className="form-control mb-2" />
//         <input name="consultation_fee" placeholder="Fee" value={form.consultation_fee} onChange={handleChange} className="form-control mb-2" />
//         <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} className="form-control mb-2" />

//         <button className="btn btn-primary">
//           {editId ? "Update Doctor" : "Add Doctor"}
//         </button>
//       </form>

//       {/* TABLE */}
//       <table className="table mt-4">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Department</th>
//             <th>Fee</th>
//             <th>Phone</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {doctors.map((doc) => (
//             <tr key={doc.doctor_id}>
//               <td>{doc.username}</td>
//               <td>{doc.department_name}</td>
//               <td>{doc.consultation_fee}</td>
//               <td>{doc.phone_number}</td>

//               <td>
//                 <button className="btn btn-warning me-2" onClick={() => handleEdit(doc)}>
//                   Edit
//                 </button>

//                 <button className="btn btn-danger" onClick={() => handleDelete(doc.doctor_id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaList } from "react-icons/fa";
import bgVideo from "/src/assets/deptdashboard.mp4";

export default function DoctorPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen flex items-center justify-center">

      {/* 🎥 Background Video */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/60"></div>

      {/* Main Card */}
      <div className="relative bg-white/90 p-10 rounded-2xl shadow-xl text-center w-[620px]">

        <h2 className="text-2xl font-bold mb-6">Doctor Management</h2>

        <div className="flex gap-4 justify-center">

          {/* ➕ Add Doctor */}
          <div
            onClick={() => navigate("/admin/doctors/add")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-blue-600 text-white p-3 rounded-full mb-3">
              <FaUserMd size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Add Doctor
            </p>
          </div>

          {/* 📋 Doctor List */}
          <div
            onClick={() => navigate("/admin/doctors/list")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-blue-600 text-white p-3 rounded-full mb-3">
              <FaList size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Doctor List
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}