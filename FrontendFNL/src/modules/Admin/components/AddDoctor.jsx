import { useState, useEffect } from "react";
import { createDoctor, getDepartments } from "../api/adminApi";
import AddDoctorPage from "../pages/AddDoctorPage";
import { useNavigate } from "react-router-dom";

export default function AddDoctor() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    user: "",
    department: "",
    date_of_birth: "",
    qualification: "",
    experience_years: "",
    license_number: "",
    consultation_fee: "",
    phone_number: "",
    status: "active",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  // 🔥 FIX: convert numbers properly
  const handleChange = (e) => {
    let value = e.target.value;

    if (
      ["user", "department", "experience_years", "consultation_fee"].includes(
        e.target.name
      )
    ) {
      value = value === "" ? "" : Number(value);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting:", formData); // 🔥 debug

    try {
      await createDoctor(formData);
      alert("Doctor Added Successfully");
      navigate("/admin/doctors/list");
    } catch (err) {
      console.error(err.response?.data);
      alert(JSON.stringify(err.response?.data)); // 🔥 show real error
    }
  };

  return (
    <AddDoctorPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      departments={departments}
    />
  );
}