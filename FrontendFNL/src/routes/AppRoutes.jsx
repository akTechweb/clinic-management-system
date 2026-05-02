import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Login from "../pages/Login";
import Home from "../pages/Home";

// Layout & Protection
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Admin Pages
import AdminDashboardPage from "../modules/Admin/pages/AdminDashboardPage";

// Reception Layout
import ReceptionLayout from "../modules/reception/components/ReceptionLayout";

// Reception Pages
import ReceptionDashboard from "../modules/reception/pages/ReceptionDashboard";
import RegisterPatient from "../modules/reception/pages/RegisterPatient";
import SearchPatient from "../modules/reception/pages/SearchPatient";
import UpdatePatient from "../modules/reception/pages/UpdatePatient";
import PatientProfile from "../modules/reception/pages/PatientProfile";
import PatientAppointments from "../modules/reception/pages/PatientAppointments";
import Appointment from "../modules/reception/pages/Appointment";
import AppointmentSearch from "../modules/reception/pages/AppointmentSearch";
import AppointmentDetail from "../modules/reception/pages/AppointmentDetail";
import WalkIn from "../modules/reception/pages/WalkIn";
import BillingList from "../modules/reception/pages/BillingList";
import Billing from "../modules/reception/pages/Billing";
import Payment from "../modules/reception/pages/Payment";
import FollowUpList from "../modules/reception/pages/FollowUpList";
import FollowUp from "../modules/reception/pages/FollowUp";
import DoctorQueue from "../modules/reception/pages/DoctorQueue";
import DoctorAvailability from "../modules/reception/pages/DoctorAvailability";

// Staff
import StaffPage from "../modules/Admin/pages/StaffPage";
import AddStaff from "../modules/Admin/components/AddStaff";
import EditStaff from "../modules/Admin/components/EditStaff";
import StaffListPage from "../modules/Admin/pages/StaffListPage";

// Department
import DepartmentPage from "../modules/Admin/pages/DepartmentPage";
import AddDepartment from "../modules/Admin/components/AddDepartment";
import EditDepartment from "../modules/Admin/components/EditDepartment";
import DepartmentListPage from "../modules/Admin/pages/DepartmentListPage";

// Doctor
import DoctorPage from "../modules/Admin/pages/DoctorPage";
import AddDoctor from "../modules/Admin/components/AddDoctor";
import DoctorListPage from "../modules/Admin/pages/DoctorListPage";
import EditDoctor from "../modules/Admin/components/EditDoctor";


export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* ================= DEPARTMENT ================= */}
        <Route path="departments" element={<DepartmentPage />} />
        <Route path="departments/add" element={<AddDepartment />} />
        <Route path="departments/list" element={<DepartmentListPage />} />
        <Route path="departments/edit/:id" element={<EditDepartment />} />
        {/* ================= DOCTOR ================= */}
        <Route path="doctors" element={<DoctorPage />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/list" element={<DoctorListPage />} />
        <Route path="doctors/edit/:id" element={<EditDoctor />} />

        {/* ================= STAFF ================= */}
        <Route path="staff" element={<StaffPage />} />
        <Route path="staff/list" element={<StaffListPage />} />
        <Route path="staff/add" element={<AddStaff />} />
        <Route path="staff/edit/:id" element={<EditStaff />} />

      </Route>

      {/* ===================== RECEPTION ===================== */}
      <Route
        path="/reception"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionDashboard />} />

        {/* ── Patients ── */}
        <Route path="patients/register" element={<RegisterPatient />} />
        <Route path="patients/search" element={<SearchPatient />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="patients/:id/update" element={<UpdatePatient />} />
        <Route path="patients/:id/appointments" element={<PatientAppointments />} />

        {/* ── Appointments ── */}
        <Route path="appointments" element={<Appointment />} />
        <Route path="appointments/search" element={<AppointmentSearch />} />
        <Route path="appointments/:id" element={<AppointmentDetail />} />

        {/* ── Walk-In ── */}
        <Route path="walk-in" element={<WalkIn />} />

        {/* ── Billing ── */}
        <Route path="billing" element={<BillingList />} />
        <Route path="billing/:appointmentId" element={<Billing />} />
        <Route path="payment/:appointmentId" element={<Payment />} />

        {/* ── Follow-Up ── */}
        <Route path="follow-up-list" element={<FollowUpList />} />
        <Route path="follow-up/:appointmentId" element={<FollowUp />} />

        {/* ── Doctors ── */}
        <Route path="doctor-queue" element={<DoctorQueue />} />
        <Route path="doctor-availability" element={<DoctorAvailability />} />

      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}