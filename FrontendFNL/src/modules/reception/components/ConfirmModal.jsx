import { useEffect, useRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ show, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger", loading = false, onConfirm, onCancel }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 2000, background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div ref={modalRef} className="bg-white rounded-3 shadow-lg" style={{ maxWidth: 420, width: "90%" }}>
        <div className="p-4">
          <div className="d-flex align-items-start gap-3">
            <div className={`rounded-circle bg-${variant} bg-opacity-10 p-2 flex-shrink-0`}>
              <FaExclamationTriangle className={`text-${variant}`} size={20} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">{title}</h6>
              <p className="text-muted small mb-0">{message}</p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary btn-sm px-3" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button className={`btn btn-${variant} btn-sm px-3`} onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-1" />{confirmText}...</> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
