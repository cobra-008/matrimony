"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  style?: React.CSSProperties;
}

export default function BackButton({ label, style }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-primary, #111)",
        padding: "0.25rem 0.375rem",
        borderRadius: "6px",
        fontFamily: "var(--font-sans)",
        fontSize: "0.875rem",
        fontWeight: 600,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}
