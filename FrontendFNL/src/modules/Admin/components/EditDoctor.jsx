import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctors,
  updateDoctor,
  getDepartments,
} from "../api/adminApi";
import AddDoctorPage from "../pages/AddDoctorPage";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDoctor();
    loadDepartments();
  }, []);

  const loadDoctor = async () => {
    const data = await getDoctors();

    const selected = data.find(
      (d) => d.doctor_id === Number(id)
    );

    if (selected) {
      setFormData(selected);
    }
  };

  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

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

    try {
      await updateDoctor(id, formData);
      alert("Updated Successfully");
      navigate("/admin/doctors/list");
    } catch (err) {
      console.error(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <AddDoctorPage
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      departments={departments}
      isEdit={true}
    />
  );
}