"use client";

import { useRouter } from "next/navigation";

interface PlanTabsProps {
  activeTab?: "regular" | "prime";
}

export default function PlanTabs({ activeTab = "regular" }: PlanTabsProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.625rem 0",
        borderBottom: "1px solid #e8e8e8",
        background: "#fff",
        gap: 0,
      }}
    >
      {/* Left line */}
      <div style={{ flex: 1, height: "1px", background: "#ddd", maxWidth: "200px" }} />

      {/* Regular tab */}
      <button
        onClick={() => {}} // already on regular features
        style={{
          padding: "0.3125rem 1.5rem",
          border: activeTab === "regular" ? "1.5px solid #E8401A" : "1.5px solid #ddd",
          borderRadius: "20px 0 0 20px",
          background: activeTab === "regular" ? "#fff" : "#f7f7f7",
          color: activeTab === "regular" ? "#E8401A" : "#888",
          fontWeight: activeTab === "regular" ? 700 : 500,
          fontSize: "0.9375rem",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.01em",
          transition: "all 0.15s",
          zIndex: 1,
          position: "relative",
        }}
      >
        Regular
      </button>

      {/* Prime tab */}
      <button
        onClick={() => router.push("/membership")}
        style={{
          padding: "0.3125rem 1.5rem",
          border: activeTab === "prime" ? "1.5px solid #6B1A2A" : "1.5px solid #ddd",
          borderRadius: "0 20px 20px 0",
          borderLeft: "none",
          background: activeTab === "prime" ? "#6B1A2A" : "#f7f7f7",
          color: activeTab === "prime" ? "#fff" : "#555",
          fontWeight: 700,
          fontSize: "0.9375rem",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.04em",
          transition: "all 0.15s",
        }}
        title="Upgrade to Prime for premium features"
      >
        PRIME
      </button>

      {/* Right line */}
      <div style={{ flex: 1, height: "1px", background: "#ddd", maxWidth: "200px" }} />
    </div>
  );
}
