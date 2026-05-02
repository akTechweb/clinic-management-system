
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/admin";

export default function useAdmin() {

  const getToken = () => localStorage.getItem("access");

  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  // ================= DEPARTMENT =================
  const getDepartments = async () => {
    const res = await axios.get(`${BASE_URL}/departments/`, authHeader());
    return res.data;
  };

  const createDepartment = async (data) => {
    const res = await axios.post(`${BASE_URL}/departments/`, data, authHeader());
    return res.data;
  };

  const updateDepartment = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/departments/${id}/`, data, authHeader());
    return res.data;
  };

  const deleteDepartment = async (id) => {
    await axios.delete(`${BASE_URL}/departments/${id}/`, authHeader());
  };

  // ================= GROUPS (IMPORTANT 🔥) =================
  const getGroups = async () => {
    const res = await axios.get(`${BASE_URL}/groups/`, authHeader());
    return res.data;
  };

  // ================= DOCTOR =================
  const getDoctors = async () => {
    const res = await axios.get(`${BASE_URL}/doctors/`, authHeader());
    return res.data;
  };

  const createDoctor = async (data) => {
    const res = await axios.post(`${BASE_URL}/doctors/`, data, authHeader());
    return res.data;
  };

  const updateDoctor = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/doctors/${id}/`, data, authHeader());
    return res.data;
  };

  const deleteDoctor = async (id) => {
    await axios.delete(`${BASE_URL}/doctors/${id}/`, authHeader());
  };

  // ================= STAFF =================
  const getStaff = async () => {
    const res = await axios.get(`${BASE_URL}/staff/`, authHeader());
    return res.data;
  };

  const createStaff = async (data) => {
    const res = await axios.post(`${BASE_URL}/staff/`, data, authHeader());
    return res.data;
  };

  const updateStaff = async (id, data) => {
    const res = await axios.put(`${BASE_URL}/staff/${id}/`, data, authHeader());
    return res.data;
  };

  const deleteStaff = async (id) => {
    await axios.delete(`${BASE_URL}/staff/${id}/`, authHeader());
  };

  return {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    getGroups,

    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,

    getStaff,
    createStaff,
    updateStaff,
    deleteStaff
  };
}