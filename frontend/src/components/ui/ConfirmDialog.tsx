"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(2px)",
      padding: "1rem",
    }}>
      <div 
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          overflow: "hidden",
          animation: "slideIn 0.2s ease-out forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border-light)",
        }}>
          <h3 style={{ margin: 0, fontSize: "1.0625rem", color: "var(--text-dark)", fontWeight: 700 }}>
            {title || "Confirm Action"}
          </h3>
          <button 
            onClick={onCancel}
            style={{ 
              background: "none", border: "none", cursor: "pointer", 
              color: "var(--text-muted)", padding: "0.25rem", display: "flex" 
            }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: "1.25rem", fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {message}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          background: "#fdfdfd",
          borderTop: "1px solid var(--border-light)",
        }}>
          <button 
            onClick={onCancel}
            className="btn btn-ghost"
            style={{ fontWeight: 600, padding: "0.5rem 1rem", border: "1px solid var(--border-color)" }}
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel(); // auto-close
            }}
            className="btn btn-primary"
            style={{ 
              fontWeight: 600, padding: "0.5rem 1.25rem",
              background: isDestructive ? "#e53935" : "var(--primary)",
              borderColor: isDestructive ? "#e53935" : "var(--primary)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
