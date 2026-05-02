import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getRoleFromResponse, probeRole } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(formData);
      const data = res.data;

      const access =
        data.data?.access ||
        data.data?.token ||
        data.access ||
        data.token;

      if (!access) throw new Error("No access token in response.");

      const refresh = data.data?.refresh || data.refresh || null;

      const usernameFromResponse =
        data.data?.username || data.username ||
        data.data?.user?.username || data.user?.username ||
        formData.username;

      let role = getRoleFromResponse(data);

      if (!role) {
        role = await probeRole(access);
      }

      login({ access, refresh, username: usernameFromResponse, role });

      navigate(role === "receptionist" ? "/reception/dashboard" : "/admin/dashboard");

    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        "Invalid username or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-400">
      <div className="bg-white rounded-2xl shadow-xl w-[350px] p-6 text-center">

        <h2 className="text-xl font-bold text-gray-700">CITY MEDICAL CENTER</h2>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left mt-4">

          <label className="text-xs font-semibold">USERNAME</label>
          <div className="relative mb-3">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded-lg bg-gray-100"
              required
            />
          </div>

          <label className="text-xs font-semibold">PASSWORD</label>
          <div className="relative mb-3">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg bg-gray-100"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-800 text-white rounded-full disabled:opacity-60 flex items-center justify-content-center gap-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : "LOGIN"}
          </button>

        </form>
      </div>
    </div>
  );
}
