"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  isNavigatingBack: boolean;
  startNavigation: (href: string) => void;
  startBackNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  isNavigatingBack: false,
  startNavigation: () => {},
  startBackNavigation: () => {},
});

export const usePageTransition = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll to top instantly and hide all loading overlays on pathname change
  useEffect(() => {
    setIsNavigating(false);
    setIsNavigatingBack(false);
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const timer = setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const startNavigation = useCallback(
    (href: string) => {
      // Instant top scroll
      if (typeof window !== "undefined") {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      // If already on the same pathname, just scroll to top
      if (typeof window !== "undefined" && window.location.pathname === href) {
        return;
      }

      // Show light shaded loading overlay with spinner immediately
      setIsNavigating(true);

      // Trigger route transition after brief delay for smooth overlay display
      setTimeout(() => {
        router.push(href);
      }, 150);

      // Fallback safety timer to hide loader if route transition hangs
      const safetyTimer = setTimeout(() => {
        setIsNavigating(false);
      }, 2500);

      return () => clearTimeout(safetyTimer);
    },
    [router]
  );

  const startBackNavigation = useCallback(() => {
    // Instant top scroll
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Show subtle light shaded overlay WITHOUT any spinner/loader
    setIsNavigatingBack(true);

    // Trigger router.back() after brief delay for smooth transition
    setTimeout(() => {
      router.back();
    }, 100);

    // Safety fallback to hide overlay
    const safetyTimer = setTimeout(() => {
      setIsNavigatingBack(false);
    }, 2000);

    return () => clearTimeout(safetyTimer);
  }, [router]);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        isNavigatingBack,
        startNavigation,
        startBackNavigation,
      }}
    >
      {children}

      {/* Light Shaded Loading Overlay WITH Centered Spinner (Footer/Link Navigation) */}
      {isNavigating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.15s ease-out forwards",
          }}
          aria-live="polite"
          aria-label="Loading page"
        >
          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem 2.25rem",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(107, 26, 42, 0.12), 0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #E5D5C5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.875rem",
              minWidth: "170px",
              animation: "slideUp 0.18s ease-out forwards",
            }}
          >
            {/* Centered Maroon Spinner */}
            <div
              style={{
                width: "42px",
                height: "42px",
                border: "3.5px solid #F5E6E9",
                borderTopColor: "#6B1A2A",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#6B1A2A",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Subtle Light Shaded Overlay WITHOUT Spinner (Back Button Navigation) */}
      {isNavigatingBack && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: "fadeIn 0.12s ease-out forwards",
            pointerEvents: "auto",
          }}
          aria-hidden="true"
        />
      )}
    </NavigationContext.Provider>
  );
}
