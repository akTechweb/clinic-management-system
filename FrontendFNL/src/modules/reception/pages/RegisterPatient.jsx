import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/api";
import Alert from "../components/Alert";
import { FaUserPlus } from "react-icons/fa";
import { parseFieldErrors } from "../utils/parseError";

const INITIAL = {
  firstName: "",
  lastName: "",
  phone: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  address: "",
};

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const today = () => new Date().toISOString().split("T")[0];

const FIELD_MAP = {
  first_name: "firstName", last_name: "lastName",
  phone_number: "phone", date_of_birth: "dob",
  gender: "gender", blood_group: "bloodGroup", address: "address",
};

function validate(form) {
  const errors = {};
  const nameRegex = /^[A-Za-z\s'-]+$/;

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (!nameRegex.test(form.firstName)) {
    errors.firstName = "First name must contain only letters.";
  }

  if (form.lastName.trim() && !nameRegex.test(form.lastName)) {
    errors.lastName = "Last name must contain only letters.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(form.phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  if (!form.dob) {
    errors.dob = "Date of birth is required.";
  } else if (form.dob > today()) {
    errors.dob = "Date of birth cannot be a future date.";
  }

  if (!form.gender) errors.gender = "Gender is required.";
  if (!form.address.trim()) errors.address = "Address is required.";

  return errors;
}

export default function RegisterPatient() {
  const [form, setForm] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone_number: form.phone.trim(),
      date_of_birth: form.dob,
      gender: form.gender,
      blood_group: form.bloodGroup,
      address: form.address.trim(),
    };

    setLoading(true);
    try {
      const res = await registerPatient(payload);

      if (!res.data?.patient_id) {
        const { fieldErrors: fe, generalMsg } = parseFieldErrors(res.data, FIELD_MAP);
        if (Object.keys(fe).length) setFieldErrors(fe);
        setApiError(generalMsg || "Registration failed. Please check your inputs.");
        return;
      }

      setSuccess(`Patient "${form.firstName.trim()}" registered successfully! Redirecting to profile...`);
      setForm(INITIAL);
      setFieldErrors({});
      setTimeout(() => navigate(`/reception/patients/${res.data.patient_id}`), 2000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const { fieldErrors: fe, generalMsg } = parseFieldErrors(data, FIELD_MAP);
        if (Object.keys(fe).length) setFieldErrors(fe);
        setApiError(generalMsg || "Failed to register patient. Please try again.");
      } else {
        setApiError("Failed to register patient. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FaUserPlus className="text-blue-700" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Register New Patient</h2>
          <p className="text-sm text-gray-500">Fill in all required fields</p>
        </div>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={apiError} onClose={() => setApiError("")} persistent />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${fieldErrors.firstName ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g. Smith"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${fieldErrors.lastName ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm((prev) => ({ ...prev, phone: val }));
                  setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="10-digit number"
                maxLength={10}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${fieldErrors.phone ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={today()}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${fieldErrors.dob ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${fieldErrors.gender ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              >
                <option value="">-- Select Gender --</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {fieldErrors.gender && <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${fieldErrors.bloodGroup ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              >
                <option value="">-- Select Blood Group --</option>
                {BLOOD_GROUP_OPTIONS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {fieldErrors.bloodGroup && <p className="text-red-500 text-xs mt-1">{fieldErrors.bloodGroup}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Street, City, State"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${fieldErrors.address ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
            </div>

          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <FaUserPlus size={14} />
                  Register Patient
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
