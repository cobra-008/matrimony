"use client";

import { useEffect } from "react";

/**
 * PageResilience — prevents the browser "Page could not be loaded" error
 * that occurs when switching apps and returning. This happens because:
 *   1. Next.js / service workers cache pages that become stale
 *   2. On mobile Chrome/Safari, returning from another app triggers a
 *      navigation event that may fail if the network connection timed out
 *
 * Fix: On visibilitychange (tab becomes visible) and on "online" events,
 * check if the page root element is still rendered. If not, reload.
 * Additionally, listen for error events on page load failures.
 */
export default function PageResilience() {
  useEffect(() => {
    let reloadTimer: ReturnType<typeof setTimeout> | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Cancel any previous pending reload
        if (reloadTimer) clearTimeout(reloadTimer);

        // Give the page a brief moment to resume, then check health
        reloadTimer = setTimeout(() => {
          // If the document body is empty or has no meaningful content, reload
          const bodyContent = document.body.innerHTML.trim();
          if (!bodyContent || bodyContent.length < 100) {
            window.location.reload();
          }
        }, 800);
      }
    };

    const handleOnline = () => {
      // When coming back online, check if we're on an error page
      const bodyContent = document.body.innerHTML.trim();
      const isErrorPage =
        document.title.toLowerCase().includes("error") ||
        bodyContent.toLowerCase().includes("page could not be loaded") ||
        bodyContent.toLowerCase().includes("net::err") ||
        bodyContent.toLowerCase().includes("failed to fetch");

      if (isErrorPage) {
        window.location.reload();
      }
    };

    // Intercept fetch errors that cause the "page could not load" state
    const originalFetch = window.fetch;
    let consecutiveFailures = 0;

    window.fetch = async (...args) => {
      try {
        const result = await originalFetch(...args);
        consecutiveFailures = 0;
        return result;
      } catch (err) {
        consecutiveFailures++;
        // If many consecutive failures and page was previously visible, the
        // network dropped while switching apps — reload when tab is next visible
        if (consecutiveFailures >= 3) {
          document.addEventListener(
            "visibilitychange",
            () => {
              if (document.visibilityState === "visible") {
                consecutiveFailures = 0;
                window.location.reload();
              }
            },
            { once: true }
          );
        }
        throw err;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.fetch = originalFetch;
      if (reloadTimer) clearTimeout(reloadTimer);
    };
  }, []);

  return null;
}
