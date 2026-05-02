// import { useEffect, useState } from "react";
// import {
//   getStaff,
//   createStaff,
//   updateStaff,
//   deleteStaff,
// } from "../api/adminApi";

// export default function StaffPage() {
//   const [staffList, setStaffList] = useState([]);

//   const [form, setForm] = useState({
//     user: "",
//     department: "",
//     date_of_birth: "",
//     blood_group: "",
//     phone_number: "",
//   });

//   const [editId, setEditId] = useState(null);

//   const fetchStaff = async () => {
//     const res = await getStaff();
//     setStaffList(res.data);
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       await updateStaff(editId, form);
//       setEditId(null);
//     } else {
//       await createStaff(form);
//     }

//     setForm({
//       user: "",
//       department: "",
//       date_of_birth: "",
//       blood_group: "",
//       phone_number: "",
//     });

//     fetchStaff();
//   };

//   const handleEdit = (staff) => {
//     setForm({
//       user: staff.user,
//       department: staff.department,
//       date_of_birth: staff.date_of_birth,
//       blood_group: staff.blood_group,
//       phone_number: staff.phone_number,
//     });

//     setEditId(staff.staff_id); // ✅ IMPORTANT
//   };

//   const handleDelete = async (id) => {
//     await deleteStaff(id);
//     fetchStaff();
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Staff Management</h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit}>
//         <input name="user" placeholder="User ID" value={form.user} onChange={handleChange} className="form-control mb-2" />
//         <input name="department" placeholder="Department ID" value={form.department} onChange={handleChange} className="form-control mb-2" />

//         <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="form-control mb-2" />

//         <select name="blood_group" value={form.blood_group} onChange={handleChange} className="form-control mb-2">
//           <option value="">Select Blood Group</option>
//           <option>A+</option>
//           <option>A-</option>
//           <option>B+</option>
//           <option>B-</option>
//           <option>O+</option>
//           <option>O-</option>
//           <option>AB+</option>
//           <option>AB-</option>
//         </select>

//         <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} className="form-control mb-2" />

//         <button className="btn btn-primary">
//           {editId ? "Update Staff" : "Add Staff"}
//         </button>
//       </form>

//       {/* TABLE */}
//       <table className="table mt-4">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Department</th>
//             <th>Blood</th>
//             <th>Phone</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {staffList.map((staff) => (
//             <tr key={staff.staff_id}>
//               <td>{staff.username}</td>
//               <td>{staff.department_name}</td>
//               <td>{staff.blood_group}</td>
//               <td>{staff.phone_number}</td>

//               <td>
//                 <button className="btn btn-warning me-2" onClick={() => handleEdit(staff)}>
//                   Edit
//                 </button>

//                 <button className="btn btn-danger" onClick={() => handleDelete(staff.staff_id)}>
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
import { FaUserNurse, FaList } from "react-icons/fa";
import bgVideo from "/src/assets/deptdashboard.mp4";

export default function StaffPage() {
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

        <h2 className="text-2xl font-bold mb-6">Staff Management</h2>

        <div className="flex gap-4 justify-center">

          {/* ➕ Add Staff */}
          <div
            onClick={() => navigate("/admin/staff/add")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-purple-600 text-white p-3 rounded-full mb-3">
              <FaUserNurse size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Add Staff
            </p>
          </div>

          {/* 📋 Staff List */}
          <div
            onClick={() => navigate("/admin/staff/list")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-purple-600 text-white p-3 rounded-full mb-3">
              <FaList size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Staff List
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

