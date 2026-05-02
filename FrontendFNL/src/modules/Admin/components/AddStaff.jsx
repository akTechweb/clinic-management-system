import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { createStaff, getDepartments } from "../api/adminApi";
import AddStaffPage from "../pages/AddStaffPage";

export default function AddStaff() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting:", formData);

  try {
    await createStaff(formData);
    alert("Staff Added Successfully");

    // ✅ REDIRECT HERE
    navigate("/admin/staff/list");
  } catch (err) {
    console.error(err.response?.data);
    alert(JSON.stringify(err.response?.data));
  }
};

  return (
    <AddStaffPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      departments={departments}
    />
  );
}