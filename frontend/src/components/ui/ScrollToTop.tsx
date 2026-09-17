"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Temporarily disable smooth scrolling so route changes jump instantly to top
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const vp = document.getElementById("app-scroll-viewport");
      if (vp) vp.scrollTop = 0;

      const timer = setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
