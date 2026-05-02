// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getStaff,
//   updateStaff,
//   getDepartments,
// } from "../api/adminApi";
// import AddStaffPage from "../pages/AddStaffPage";

// export default function EditStaff() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     role: "",
//     department: "",
//     phone_number: "",
//     date_of_birth: "",
//     blood_group: "",
//     status: "active",
//   });

//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     loadStaff();
//     loadDepartments();
//   }, []);

//   const loadStaff = async () => {
//     const data = await getStaff();

//     const selected = data.find(
//       (s) => s.staff_id === Number(id)
//     );

//     if (selected) {
//       setFormData({
//         ...selected,
//         department: selected.department,
//         role: selected.role_name || "",
//       });
//     }
//   };

//   const loadDepartments = async () => {
//     const res = await getDepartments();
//     setDepartments(res.data || res);
//   };

//   const handleChange = (e) => {
//     let value = e.target.value;

//     if (e.target.name === "department") {
//       value = value === "" ? "" : Number(value);
//     }

//     setFormData({
//       ...formData,
//       [e.target.name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await updateStaff(id, formData);
//       alert("Updated Successfully ✅");
//       navigate("/admin/staff");
//     } catch (err) {
//       console.error(err.response?.data);
//       alert(JSON.stringify(err.response?.data));
//     }
//   };

//   return (
//     <AddStaffPage
//       formData={formData}
//       handleChange={handleChange}
//       handleSubmit={handleSubmit}
//       departments={departments}
//       isEdit={true}
//     />
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStaffById,
  updateStaff,
  getDepartments,
} from "../api/adminApi";
import AddStaffPage from "../pages/AddStaffPage";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "", // keep empty for edit
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    department: "",
    phone_number: "",
    date_of_birth: "",
    blood_group: "",
    status: "active",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadStaff();
    loadDepartments();
  }, []);

  // ✅ Format date for input type="date"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  // ✅ Load single staff
  const loadStaff = async () => {
    try {
      const data = await getStaffById(id);

      setFormData({
        username: data.user_username || "",
        password: "", // never prefill password
        first_name: data.user_first_name || "",
        last_name: data.user_last_name || "",
        email: data.user_email || "",
        role: data.role_name || "",
        department: data.department || "",
        phone_number: data.phone_number || "",
        date_of_birth: formatDate(data.date_of_birth),
        blood_group: data.blood_group || "",
        status: data.status || "active",
      });

    } catch (error) {
      console.error("Error loading staff:", error);
    }
  };

  // ✅ Load departments
  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data || res);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "department") {
      value = value === "" ? "" : Number(value);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateStaff(id, formData);
      alert("Updated Successfully");
      navigate("/admin/staff/list");
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data) {
        alert(JSON.stringify(err.response.data, null, 2));
      } else {
        alert("Update failed");
      }
    }
  };

  return (
    <AddStaffPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      departments={departments}
      isEdit={true}
    />
  );
}