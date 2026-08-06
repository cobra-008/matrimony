"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Heart, MessageSquare, Search, Bell, Send } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/interests", label: "Interests", icon: Send },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Only show when logged in
  if (!user) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`bottom-nav-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer so page content isn't hidden behind the bottom nav */}
      <div className="bottom-nav-spacer" aria-hidden="true" />
    </>
  );
}
