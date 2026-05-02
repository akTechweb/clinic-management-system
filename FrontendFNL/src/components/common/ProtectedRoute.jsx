import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = localStorage.getItem("user_role");

    if (!role) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
      if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
      if (role === "receptionist") return <Navigate to="/reception/dashboard" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
