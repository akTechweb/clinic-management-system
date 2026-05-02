// import { useEffect, useState, useNavigate } from "react";
// import { FaPlusCircle, FaList } from "react-icons/fa";
// //import bgVideo from "../../../assets/medical-bg.mp4";
// import {
//   getDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../api/adminApi";

// export default function DepartmentPage() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [form, setForm] = useState({
//     dept_code: "",
//     dept_name: "",
//   });

//   const [editId, setEditId] = useState(null);

//   const fetchData = async () => {
//     const res = await getDepartments();
//     setData(res.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       await updateDepartment(editId, form);
//       setEditId(null);
//     } else {
//       await createDepartment(form);
//     }

//     setForm({ dept_code: "", dept_name: "" });
//     fetchData();
//   };

//   const handleEdit = (item) => {
//     setForm(item);
//     setEditId(item.dept_id);
//   };

//   const handleDelete = async (id) => {
//     await deleteDepartment(id);
//     fetchData();
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Department</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="Code"
//           value={form.dept_code}
//           onChange={(e) =>
//             setForm({ ...form, dept_code: e.target.value })
//           }
//           className="form-control mb-2"
//         />

//         <input
//           placeholder="Name"
//           value={form.dept_name}
//           onChange={(e) =>
//             setForm({ ...form, dept_name: e.target.value })
//           }
//           className="form-control mb-2"
//         />

//         <button className="btn btn-primary">
//           {editId ? "Update" : "Add"}
//         </button>
//       </form>

//       <table className="table mt-4">
//         <tbody>
//           {data.map((d) => (
//             <tr key={d.dept_id}>
//               <td>{d.dept_code}</td>
//               <td>{d.dept_name}</td>

//               <td>
//                 <button onClick={() => handleEdit(d)}>Edit</button>
//                 <button onClick={() => handleDelete(d.dept_id)}>
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
import { FaPlus, FaList } from "react-icons/fa";
import bgVideo from "/src/assets/deptdashboard.mp4"; // your video path

export default function DepartmentPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen flex items-center justify-center">

      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/60"></div>

      {/* Main Card */}
      <div className="relative bg-white/90 p-10 rounded-2xl shadow-xl text-center w-[620px]">

        <h2 className="text-2xl font-bold mb-6">Department Management</h2>

        {/* Cards Container */}
        <div className="flex gap-4 justify-center">

          {/* ➕ Add Department Card */}
          <div
            onClick={() => navigate("/admin/departments/add")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-teal-600 text-white p-3 rounded-full mb-3">
              <FaPlus size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Add Department
            </p>
          </div>

          {/* 📋 View List Card */}
          <div
            onClick={() => navigate("/admin/departments/list")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 w-40 flex flex-col items-center hover:shadow-xl transition"
          >
            <div className="bg-teal-600 text-white p-3 rounded-full mb-3">
              <FaList size={18} />
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              Department List
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}