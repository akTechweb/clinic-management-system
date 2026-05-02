const FIELD_LABELS = {
  first_name: "First Name",
  last_name: "Last Name",
  phone_number: "Phone Number",
  date_of_birth: "Date of Birth",
  gender: "Gender",
  blood_group: "Blood Group",
  address: "Address",
  appointment: "Appointment",
  appointment_date: "Date",
  appointment_time: "Time",
  doctor: "Doctor",
  patient: "Patient",
  visit_type: "Visit Type",
  bill_id: "Bill",
  payment_method: "Payment Method",
  pharmacy_cost: "Pharmacy Cost",
  discount: "Discount",
  reason: "Reason",
  consultation_note: "Consultation Note",
  parent_appointment: "Parent Appointment",
  non_field_errors: "",
  detail: "",
  error: "",
  message: "",
};

function friendlyLabel(key) {
  if (FIELD_LABELS[key] !== undefined) return FIELD_LABELS[key];
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function flattenValue(v) {
  if (Array.isArray(v)) return v.map(flattenValue).join(", ");
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return String(v);
}

export function parseApiError(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data ?? err?.data ?? err;

  if (!data) return fallback;
  if (typeof data === "string") return data || fallback;

  if (data.detail) return flattenValue(data.detail);
  if (data.error) return flattenValue(data.error);
  if (data.message) return flattenValue(data.message);

  if (typeof data === "object") {
    const parts = [];
    for (const [key, val] of Object.entries(data)) {
      const label = friendlyLabel(key);
      const msg = flattenValue(val);
      if (!label) {
        parts.push(msg);
      } else {
        parts.push(`${label}: ${msg}`);
      }
    }
    if (parts.length > 0) return parts.join(" \u2022 ");
  }

  return fallback;
}

export function checkResponseError(data) {
  if (!data) return null;
  if (data.error) return flattenValue(data.error);
  if (data.detail) return flattenValue(data.detail);
  if (data.non_field_errors) return flattenValue(data.non_field_errors);
  if (data.message && typeof data.message === "string" && /error|fail|invalid|denied/i.test(data.message))
    return data.message;

  const KNOWN_SUCCESS_KEYS = new Set([
    "appointment_id", "patient_id", "bill_id", "token", "token_number",
    "id", "status", "payment_status", "created_at", "updated_at",
    "appointment", "patient", "doctor", "total_amount",
    "appointment_date", "appointment_time",
    "patient_name", "doctor_name", "visit_type",
    "consultation_fee", "pharmacy_cost", "discount", "lab_cost",
    "payment_method", "paid_at", "is_emergency", "cancellation_reason",
    "follow_ups", "consultation_history", "history",
    "date", "total_appointments", "completed", "pending", "revenue",
    "revenue_collected", "results", "count",
  ]);

  if (typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    const hasFieldError = keys.some((k) => !KNOWN_SUCCESS_KEYS.has(k) && Array.isArray(data[k]));
    if (hasFieldError) {
      const parts = [];
      for (const [key, val] of Object.entries(data)) {
        if (Array.isArray(val)) {
          const label = friendlyLabel(key);
          const msg = flattenValue(val);
          parts.push(label ? `${label}: ${msg}` : msg);
        }
      }
      if (parts.length > 0) return parts.join(" \u2022 ");
    }
  }

  return null;
}

export function parseFieldErrors(data, fieldMap) {
  const fieldErrors = {};
  const generalMsgs = [];

  if (!data || typeof data !== "object") return { fieldErrors, generalMsg: "" };

  for (const [key, val] of Object.entries(data)) {
    const msg = flattenValue(val);
    const frontKey = fieldMap?.[key];
    if (frontKey) {
      fieldErrors[frontKey] = msg;
    } else {
      const label = friendlyLabel(key);
      generalMsgs.push(label ? `${label}: ${msg}` : msg);
    }
  }

  return { fieldErrors, generalMsg: generalMsgs.join(" \u2022 ") };
}
