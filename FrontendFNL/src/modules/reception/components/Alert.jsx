import { useEffect, useState, useRef } from "react";
import {
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaTimesCircle, FaTimes,
} from "react-icons/fa";

const CONFIG = {
  success: {
    icon: FaCheckCircle,
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    iconColor: "text-green-500",
    bar: "bg-green-500",
  },
  error: {
    icon: FaTimesCircle,
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    iconColor: "text-red-500",
    bar: "bg-red-500",
  },
  warning: {
    icon: FaExclamationTriangle,
    bg: "bg-amber-50",
    border: "border-amber-400",
    text: "text-amber-800",
    iconColor: "text-amber-500",
    bar: "bg-amber-500",
  },
  info: {
    icon: FaInfoCircle,
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    iconColor: "text-blue-500",
    bar: "bg-blue-500",
  },
};

const AUTO_DISMISS_MS = 5000;

export default function Alert({
  type = "info",
  message,
  onClose,
  autoDismiss,
  persistent = false,
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);
  const shouldAutoDismiss =
    autoDismiss !== undefined ? autoDismiss : type === "success";

  useEffect(() => {
    if (message) {
      setExiting(false);
      requestAnimationFrame(() => setVisible(true));

      if (shouldAutoDismiss && !persistent && onClose) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => handleClose(), AUTO_DISMISS_MS);
      }
    } else {
      setVisible(false);
    }

    return () => clearTimeout(timerRef.current);
  }, [message]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onClose?.();
    }, 300);
  };

  if (!message) return null;

  const cfg = CONFIG[type] || CONFIG.info;
  const Icon = cfg.icon;

  const renderMessage = () => {
    if (typeof message === "object" && message !== null && !Array.isArray(message)) {
      const entries = Object.entries(message);
      if (entries.length === 1) {
        const [, v] = entries[0];
        return <span>{Array.isArray(v) ? v.join(", ") : String(v)}</span>;
      }
      return (
        <ul className="mb-0 ps-3" style={{ listStyleType: "disc" }}>
          {entries.map(([k, v]) => (
            <li key={k}>
              <strong className="text-capitalize">{k.replace(/_/g, " ")}:</strong>{" "}
              {Array.isArray(v) ? v.join(", ") : String(v)}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{message}</span>;
  };

  return (
    <div
      className={`rounded-lg border-l-4 ${cfg.border} ${cfg.bg} px-4 py-3 mb-4 shadow-sm`}
      style={{
        transition: "all 0.3s ease",
        opacity: visible && !exiting ? 1 : 0,
        transform: visible && !exiting ? "translateY(0)" : "translateY(-8px)",
      }}
      role="alert"
    >
      <div className="d-flex align-items-start gap-3">
        <Icon className={`${cfg.iconColor} mt-1 flex-shrink-0`} size={18} />
        <div className={`flex-grow-1 ${cfg.text}`} style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
          {renderMessage()}
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className={`btn btn-sm p-0 border-0 ${cfg.text} opacity-50`}
            style={{ background: "none", lineHeight: 1 }}
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {shouldAutoDismiss && !persistent && (
        <div className="mt-2 rounded-full overflow-hidden" style={{ height: 3 }}>
          <div
            className={`h-100 ${cfg.bar}`}
            style={{
              animation: `alertCountdown ${AUTO_DISMISS_MS}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
