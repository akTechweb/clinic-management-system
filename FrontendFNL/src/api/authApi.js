import axios from "axios";

const BASE = "http://127.0.0.1:8000/api";

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginApi = (data) =>
  axios.post(`${BASE}/auth/login/`, data);

// ── Extract role from login response ─────────────────────────────────────────
// Your backend returns: { role: 1, data: { access, refresh } }
// Role mapping (from your backend):
//   1  → receptionist
//   2+ → admin  (adjust ADMIN_ROLE_IDS if your values differ)
const RECEPTIONIST_ROLE_IDS = [1];

export const getRoleFromResponse = (data) => {
  const rawRole =
    data.role ?? data.user_type ?? data.type ??
    data.user?.role ?? data.user?.user_type ?? null;

  if (rawRole !== null && rawRole !== undefined) {
    // Numeric role — use the mapping above
    if (typeof rawRole === "number") {
      return RECEPTIONIST_ROLE_IDS.includes(rawRole) ? "receptionist" : "admin";
    }

    // String role — match by keyword
    if (typeof rawRole === "string") {
      const roleStr = rawRole.toLowerCase();
      if (roleStr.includes("recept")) return "receptionist";
      if (roleStr.includes("admin")) return "admin";
    }
  }

  // Groups array — ["Receptionist"] or [{name:"Receptionist"}]
  const groups = data.groups || data.user?.groups || [];
  for (const g of groups) {
    const name = (typeof g === "string" ? g : g.name || g.label || "").toLowerCase();
    if (name.includes("recept")) return "receptionist";
    if (name.includes("admin")) return "admin";
  }

  return null; // nothing found → fall through to probeRole
};

// ── Fallback: probe reception endpoints to determine access ───────────────────
// Tries multiple reception API endpoints. If ANY returns 200/201/204 → receptionist.
// If all return 403 → admin. If all return 404/other → default to admin.
export const probeRole = async (token) => {
  const headers = { Authorization: `Bearer ${token}` };

  // Reception endpoints to probe (use whichever your backend has)
  const receptionEndpoints = [
    `${BASE}/reception/dashboard/`,
    `${BASE}/reception/patients/`,
    `${BASE}/reception/appointments/`,
  ];

  for (const url of receptionEndpoints) {
    try {
      const res = await axios.get(url, { headers, timeout: 5000 });
      console.log(`[RoleProbe] ${url} → ${res.status} → RECEPTIONIST`);
      return "receptionist";
    } catch (err) {
      const status = err.response?.status;
      console.log(`[RoleProbe] ${url} → ${status ?? "network error"}`);

      if (status === 403) {
        // Forbidden = authenticated but no reception access → admin
        console.log("[RoleProbe] 403 received → ADMIN");
        return "admin";
      }
      // 404 / 500 / network error → try next endpoint
    }
  }

  // All probes failed without a clear 403 — check admin access
  try {
    await axios.get(`${BASE}/admin/departments/`, { headers, timeout: 5000 });
    console.log("[RoleProbe] Admin API accessible → ADMIN");
    return "admin";
  } catch {
    // Cannot determine — default
    console.log("[RoleProbe] Cannot determine role — defaulting to admin");
    return "admin";
  }
};
