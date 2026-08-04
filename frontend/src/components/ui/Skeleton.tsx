// src/components/ui/Skeleton.tsx
// Reusable skeleton loading component for site-wide use.
// Uses the .skeleton CSS class + shimmer animation from globals.css.

import React from "react";

// ── Base skeleton block ────────────────────────────────────────────────
export function Skeleton({
  width = "100%",
  height = "16px",
  borderRadius = "6px",
  className = "",
  style = {},
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
      aria-hidden="true"
    />
  );
}

// ── Profile card skeleton (matches page) ──────────────────────────────
export function ProfileCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        marginBottom: "12px",
      }}
      aria-label="Loading profile…"
      role="status"
    >
      {/* Photo placeholder */}
      <div style={{ width: "160px", flexShrink: 0 }}>
        <Skeleton width={160} height={180} borderRadius={0} />
      </div>
      {/* Info */}
      <div style={{ flex: 1, padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <Skeleton width="40%" height="12px" />
        <Skeleton width="55%" height="18px" />
        <Skeleton width="30%" height="11px" />
        <Skeleton width="90%" height="13px" />
        <Skeleton width="75%" height="13px" />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.5rem" }}>
          <Skeleton width={100} height={32} borderRadius="20px" />
          <Skeleton width={130} height={32} borderRadius="20px" />
        </div>
      </div>
    </div>
  );
}

// ── Grid profile card skeleton (homepage / search) ────────────────────
export function GridProfileCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <Skeleton width="100%" height={220} borderRadius={0} />
      <div style={{ padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="80%" height="12px" />
        <Skeleton width="70%" height="12px" />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <Skeleton width={90} height={30} borderRadius="20px" />
          <Skeleton width={110} height={30} borderRadius="20px" />
        </div>
      </div>
    </div>
  );
}

// ── Profile view page skeleton ─────────────────────────────────────────
export function ProfileViewSkeleton() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Hero photo area */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <Skeleton width={240} height={280} borderRadius="12px" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem", minWidth: 200 }}>
          <Skeleton width="50%" height="28px" />
          <Skeleton width="35%" height="16px" />
          <Skeleton width="80%" height="14px" />
          <Skeleton width="70%" height="14px" />
          <Skeleton width="60%" height="14px" />
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <Skeleton width={140} height={40} borderRadius="20px" />
            <Skeleton width={140} height={40} borderRadius="20px" />
          </div>
        </div>
      </div>
      {/* Sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem" }}
        >
          <Skeleton width="30%" height="18px" style={{ marginBottom: "1rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.875rem" }}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <Skeleton width="45%" height="11px" />
                <Skeleton width="70%" height="14px" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar skeleton (matches page sidebar) ────────────────────────────
export function SidebarSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>
          <Skeleton width="70%" height="13px" style={{ marginBottom: "0.375rem" }} />
          <Skeleton width="90%" height="11px" />
        </div>
      ))}
    </div>
  );
}

// ── Navbar user area skeleton ──────────────────────────────────────────
export function NavUserSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <Skeleton width={32} height={32} borderRadius="50%" />
      <Skeleton width={80} height="13px" />
    </div>
  );
}

// ── Edit profile section skeleton ──────────────────────────────────────
export function EditProfileSkeleton() {
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#fff", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-light)" }}>
          <Skeleton width="100%" height="8px" borderRadius="4px" style={{ marginBottom: "0.5rem" }} />
          <Skeleton width="60%" height="11px" />
        </div>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>
            <Skeleton width="75%" height="13px" />
          </div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ flex: 1 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "12px", marginBottom: "1.25rem", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-light)", background: "#fafafa" }}>
              <Skeleton width="35%" height="16px" />
            </div>
            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j}>
                  <Skeleton width="50%" height="11px" style={{ marginBottom: "0.375rem" }} />
                  <Skeleton width="100%" height="38px" borderRadius="6px" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
