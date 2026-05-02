import { useState } from "react";
import { createDepartment } from "../api/adminApi";
import AddDepartmentPage from "../pages/AddDepartmentPage";
import { useNavigate } from "react-router-dom";

export default function AddDepartment() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dept_code: "",
    dept_name: "",
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const res = await createDepartment(formData);
          console.log("Added:", res);
          alert("Department Added");
          navigate("/admin/departments/list");
        } catch (err) {
          console.error(err.response?.data || err);
          alert("Error adding department");
        }
      };

  return (
    <AddDepartmentPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}