import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function decodeTokenPayload(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user_info");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token && !user) {
      const payload = decodeTokenPayload(token);
      const storedRole = localStorage.getItem("user_role");
      const info = {
        username: payload?.username || payload?.user || payload?.name || payload?.sub || "Receptionist",
        role: payload?.role || payload?.user_type || storedRole || "receptionist",
      };
      setUser(info);
      localStorage.setItem("user_info", JSON.stringify(info));
      if (!storedRole && info.role) {
        localStorage.setItem("user_role", info.role);
      }
    }
  }, [token]);

  const login = ({ access, refresh, username, role }) => {
    localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    setToken(access);

    const payload = decodeTokenPayload(access);
    const info = {
      username: username || payload?.username || payload?.user || payload?.name || payload?.sub || "Receptionist",
      role: role || payload?.role || payload?.user_type || "receptionist",
    };
    setUser(info);
    localStorage.setItem("user_info", JSON.stringify(info));
    if (info.role) localStorage.setItem("user_role", info.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_role");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
