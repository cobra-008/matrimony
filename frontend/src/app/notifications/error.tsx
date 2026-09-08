"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Notifications page error:", error);
  }, [error]);

  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <AlertCircle size={48} style={{ color: "var(--danger)", margin: "0 auto 1rem" }} />
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>Something went wrong!</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        We couldn't load your notifications right now.
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: "var(--primary)",
          color: "white",
          border: "none",
          padding: "0.5rem 1.5rem",
          borderRadius: "var(--radius-full)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
