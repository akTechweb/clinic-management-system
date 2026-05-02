import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartments, updateDepartment } from "../api/adminApi";
import AddDepartmentPage from "../pages/AddDepartmentPage";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dept_code: "",
    dept_name: "",
    status: "active",
  });

  // 🔹 Load department data
  useEffect(() => {
    loadDepartment();
  }, []);

  const loadDepartment = async () => {
    try {
      const data = await getDepartments();

      const selected = data.find(
        (d) => d.dept_id === Number(id)
      );

      if (selected) {
        setFormData({
          dept_code: selected.dept_code || "",
          dept_name: selected.dept_name || "",
          status: selected.status || "active",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 FIXED UPDATE FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ SEND FULL DATA (IMPORTANT)
      const payload = {
        dept_code: formData.dept_code,
        dept_name: formData.dept_name,
        status: formData.status,
      };

      console.log("Updating:", payload); // debug

      await updateDepartment(id, payload);

      alert("Department updated successfully");
      navigate("/admin/departments/list");

    } catch (err) {
      console.error("ERROR:", err.response?.data); // 🔥 shows real error
      alert("Update failed");
    }
  };

  return (
    <AddDepartmentPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isEdit={true}
    />
  );
}