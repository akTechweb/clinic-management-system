import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 15000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const R = "/reception";

export const registerPatient = (data) => API.post(`${R}/patients/`, data);
export const searchPatients = (q) => API.get(`${R}/patients/search/`, { params: { q } });
export const getPatient = (id) => API.get(`${R}/patients/${id}/`);
export const updatePatient = (id, data) => API.put(`${R}/patients/${id}/update/`, data);
export const deletePatient = (id) => API.post(`${R}/patients/${id}/delete/`);
export const getPatientAppointments = (patientId) => API.get(`${R}/appointments/patient/${patientId}/`);

export const createAppointment = (data) => API.post(`${R}/appointments/`, data);
export const getAppointmentsByDate = (date) => API.get(`${R}/appointments/by-date/`, { params: { date } });
export const searchAppointments = (params) => API.get(`${R}/appointments/search/`, { params });
export const getAppointment = (id) => API.get(`${R}/appointment/${id}/`);
export const cancelAppointment = (id, reason) =>
  API.post(`${R}/appointment/cancel/`, { appointment: id, reason });
export const rescheduleAppointment = (id, appointmentDate, appointmentTime) =>
  API.post(`${R}/appointment/reschedule/`, {
    appointment: id,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
  });
export const markNoShow = (id) => API.post(`${R}/appointment/no-show/`, { appointment: id });
export const markAsArrived = (id) => API.post(`${R}/appointment/arrive/`, { appointment: id });

export const createFollowUp = (data) => API.post(`${R}/followup/create/`, data);

export const createWalkIn = (data) => API.post(`${R}/walkin/`, data);

export const createBill = (data) => API.post(`${R}/billing/create/`, data);
export const getBillByAppointment = (appointmentId) => API.get(`${R}/billing/${appointmentId}/`);
export const payBill = (billId, paymentMethod) =>
  API.post(`${R}/billing/pay/`, { bill_id: billId, payment_method: paymentMethod });
export const getBillPDFUrl = (billId) =>
  `http://127.0.0.1:8000/api${R}/billing/pdf/${billId}/`;
export const downloadBillPDF = (billId) =>
  API.get(`${R}/billing/pdf/${billId}/`, { responseType: "blob" });

export const getDoctors = async () => {
  const endpoints = [`${R}/doctors/`, `/admin/doctors/`];
  let lastErr;
  for (const url of endpoints) {
    try {
      const res = await API.get(url);
      return res;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
};
export const getDoctorAvailability = (doctorId, date) =>
  API.get(`${R}/doctor/availability/`, { params: { doctor: doctorId, date } });
export const getDoctorQueue = () => API.get(`${R}/doctor/queue/`);
export const completeConsultation = (appointment, consultationNote) =>
  API.post(`${R}/doctor/complete/`, { appointment, consultation_note: consultationNote });
export const getPatientHistory = (patientId) =>
  API.get(`${R}/doctor/history/${patientId}/`);

export const getDashboardStats = () => API.get(`${R}/dashboard/`);

export default API;
