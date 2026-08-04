"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", marginBottom: "1rem" }}
    >
      {/* Trigger Button (looks exactly like the native select) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        className="form-select"
        style={{
          paddingTop: value ? "1.375rem" : "0.75rem",
          paddingBottom: value ? "0.375rem" : "0.75rem",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: "46px",
          background: disabled ? "#F7F7F7" : "#fff",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: value ? "var(--text-dark)" : "var(--text-muted)",
          }}
        >
          {value || placeholder || `Select ${label}`}
        </span>
        <ChevronDown size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      </button>

      {/* Floating Label */}
      {value && (
        <span
          style={{
            position: "absolute",
            top: "0.3125rem",
            left: "0.875rem",
            fontSize: "0.6875rem",
            color: disabled ? "var(--text-muted)" : "var(--primary)",
            fontWeight: 700,
            pointerEvents: "none",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 100,
            animation: "fadeIn 0.15s ease",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#F9FAFB",
            }}
          >
            <Search size={14} style={{ color: "var(--text-muted)", marginLeft: "4px" }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "0.875rem",
                color: "var(--text-dark)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>

          {/* Options List */}
          <ul
            role="listbox"
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li key={opt} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      textAlign: "left",
                      background: value === opt ? "var(--primary-light)" : "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--border-light)",
                      fontSize: "0.875rem",
                      color: value === opt ? "var(--primary)" : "var(--text-dark)",
                      fontWeight: value === opt ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (value !== opt) {
                        e.currentTarget.style.background = "#F3F4F6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== opt) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))
            ) : (
              <li
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                No sub-castes available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
