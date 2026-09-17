"use client";

import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/ui/NavigationLoader";

interface BackButtonProps {
  label?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function BackButton({ label, style, onClick }: BackButtonProps) {
  const router = useRouter();
  const { startBackNavigation } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (startBackNavigation) {
      startBackNavigation();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
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
