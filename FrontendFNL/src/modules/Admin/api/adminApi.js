// import axios from "axios";

// // ======================================
// // BASE AXIOS INSTANCE
// // ======================================
// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
// });

// // ======================================
// // 🔐 REQUEST INTERCEPTOR (Attach Token)
// // ======================================
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("access");

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// // ======================================
// // 🔁 RESPONSE INTERCEPTOR (Auto Refresh)
// // ======================================
// API.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refresh = localStorage.getItem("refresh");

//         const res = await axios.post(
//           "http://127.0.0.1:8000/api/token/refresh/",
//           { refresh }
//         );

//         localStorage.setItem("access", res.data.access);

//         originalRequest.headers.Authorization =
//           `Bearer ${res.data.access}`;

//         return API(originalRequest);

//       } catch (err) {
//         console.error("Session expired. Redirecting to login...");
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // ======================================
// // BASE PATH
// // ======================================
// const ADMIN = "/admin";

// // ======================================
// // 👥 GROUPS
// // ======================================
// export const getGroups = async () => {
//   const res = await API.get(`${ADMIN}/groups/`);
//   return res.data;
// };

// // ======================================
// // 🏢 DEPARTMENT
// // ======================================
// export const getDepartments = async () => {
//   const res = await API.get(`${ADMIN}/departments/`);
//   return res.data;
// };

// export const createDepartment = async (data) => {
//   const res = await API.post(`${ADMIN}/departments/`, data);
//   return res.data;
// };

// export const updateDepartment = async (id, data) => {
//   const res = await API.put(`${ADMIN}/departments/${id}/`, data);
//   return res.data;
// };

// export const deleteDepartment = async (id) => {
//   const res = await API.delete(`${ADMIN}/departments/${id}/`);
//   return res.data;
// };

// // ======================================
// // 👩‍💼 STAFF
// // ======================================
// export const getStaff = async () => {
//   const res = await API.get(`${ADMIN}/staff/`);
//   return res.data;
// };

// export const getStaffById = async (id) => {
//   const res = await API.get(`${ADMIN}/staff/${id}/`);
//   return res.data;
// };

// export const createStaff = async (data) => {
//   const res = await API.post(`${ADMIN}/staff/`, data);
//   return res.data;
// };

// export const updateStaff = async (id, data) => {
//   const res = await API.put(`${ADMIN}/staff/${id}/`, data);
//   return res.data;
// };

// export const deleteStaff = async (id) => {
//   const res = await API.delete(`${ADMIN}/staff/${id}/`);
//   return res.data;
// };

// // ======================================
// // 🧑‍⚕️ DOCTOR
// // ======================================
// export const getDoctors = async () => {
//   const res = await API.get(`${ADMIN}/doctors/`);
//   return res.data;
// };

// export const getDoctorById = async (id) => {
//   const res = await API.get(`${ADMIN}/doctors/${id}/`);
//   return res.data;
// };

// export const createDoctor = async (data) => {
//   const res = await API.post(`${ADMIN}/doctors/`, data);
//   return res.data;
// };

// export const updateDoctor = async (id, data) => {
//   const res = await API.put(`${ADMIN}/doctors/${id}/`, data);
//   return res.data;
// };

// export const deleteDoctor = async (id) => {
//   const res = await API.delete(`${ADMIN}/doctors/${id}/`);
//   return res.data;
// };

// export default API;

import axios from "axios";

// ======================================
// BASE AXIOS INSTANCE
// ======================================
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// ======================================
// 🔐 REQUEST INTERCEPTOR (Attach Token)
// ======================================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ======================================
// 🔁 RESPONSE INTERCEPTOR (Auto Refresh)
// ======================================
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // No refresh token flow — clear and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ======================================
// BASE PATH
// ======================================
const ADMIN = "/admin";

// ======================================
// 👥 GROUPS
// ======================================
export const getGroups = async () => {
  const res = await API.get(`${ADMIN}/groups/`);
  return res.data;
};

// ======================================
// 🏢 DEPARTMENT
// ======================================
export const getDepartments = async () => {
  const res = await API.get(`${ADMIN}/departments/`);
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await API.post(`${ADMIN}/departments/`, data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await API.put(`${ADMIN}/departments/${id}/`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await API.delete(`${ADMIN}/departments/${id}/`);
  return res.data;
};

// ======================================
// 👩‍💼 STAFF
// ======================================
export const getStaff = async () => {
  const res = await API.get(`${ADMIN}/staff/`);
  return res.data;
};

export const getStaffById = async (id) => {
  const res = await API.get(`${ADMIN}/staff/${id}/`);
  return res.data;
};

export const createStaff = async (data) => {
  const res = await API.post(`${ADMIN}/staff/`, data);
  return res.data;
};

export const updateStaff = async (id, data) => {
  const res = await API.put(`${ADMIN}/staff/${id}/`, data);
  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await API.delete(`${ADMIN}/staff/${id}/`);
  return res.data;
};

// ======================================
// 🧑‍⚕️ DOCTOR
// ======================================
export const getDoctors = async () => {
  const res = await API.get(`${ADMIN}/doctors/`);
  return res.data;
};

export const getDoctorById = async (id) => {
  const res = await API.get(`${ADMIN}/doctors/${id}/`);
  return res.data;
};

export const createDoctor = async (data) => {
  const res = await API.post(`${ADMIN}/doctors/`, data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await API.put(`${ADMIN}/doctors/${id}/`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await API.delete(`${ADMIN}/doctors/${id}/`);
  return res.data;
};

export default API;