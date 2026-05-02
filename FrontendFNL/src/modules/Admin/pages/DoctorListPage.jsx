// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDoctors, deleteDoctor } from "../api/adminApi";

// export default function DoctorListPage() {
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const fetchDoctors = async () => {
//     const data = await getDoctors();
//     setDoctors(data);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure to delete?")) {
//       await deleteDoctor(id);
//       fetchDoctors();
//     }
//   };

//   return (
//     <div>
//       <h2>Doctor List</h2>

//       <button onClick={() => navigate("/admin/doctors/add")}>
//         + Add Doctor
//       </button>

//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Username</th>
//             <th>Department</th>
//             <th>Qualification</th>
//             <th>Fee</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {doctors.map((d) => (
//             <tr key={d.doctor_id}>
//               <td>{d.doctor_id}</td>
//               <td>{d.username}</td>
//               <td>{d.department_name}</td>
//               <td>{d.qualification}</td>
//               <td>{d.consultation_fee}</td>

//               <td>
//                 <button
//                   onClick={() =>
//                     navigate(`/admin/doctors/edit/${d.doctor_id}`)
//                   }
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(d.doctor_id)}
//                   style={{ color: "red" }}
//                 >
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


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors, deleteDoctor } from "../api/adminApi";

export default function DoctorListPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      await deleteDoctor(id);
      loadDoctors();
    }
  };

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between mb-3">
        <h2>Doctor List</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/doctors/add")}
        >
          + Add Doctor
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Doctor</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Qualification</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doc, index) => (
            <tr key={doc.doctor_id}>
              <td>{index + 1}</td>
              <td>
                <div>
                  <strong>Dr. {doc.username}</strong>
                  <br />
                  <small className="text-muted">{doc.email}</small>
                </div>
              </td>
              <td>{doc.phone_number}</td>
              <td>{doc.department_name}</td>
              <td>{doc.qualification}</td>
              <td>{doc.consultation_fee}</td>
              <td>{doc.status}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    navigate(`/admin/doctors/edit/${doc.doctor_id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(doc.doctor_id)}
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