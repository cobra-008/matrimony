"use client";

// src/hooks/useMSG91.ts
// Loads the MSG91 OTP widget (otp-provider.js) and exposes its methods as
// promise-based wrappers. Uses `exposeMethods: true` so no popup is shown —
// your own UI handles the OTP input.

import { useEffect, useRef, useState } from "react";

// ── Global type augmentation ──────────────────────────────────────────────────
declare global {
  interface Window {
    initSendOTP: (config: MSG91Config) => void;
    sendOtp: (
      identifier: string,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void
    ) => void;
    verifyOtp: (
      otp: string | number,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void,
      reqId?: string
    ) => void;
    retryOtp: (
      channel: string | null,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void,
      reqId?: string
    ) => void;
    getWidgetData: () => unknown;
    isCaptchaVerified: () => boolean;
  }
}

interface MSG91Config {
  widgetId: string;
  tokenAuth: string;
  exposeMethods: boolean;
  captchaRenderId?: string;
  success?: (data: unknown) => void;
  failure?: (error: unknown) => void;
}

interface MSG91VerifyData {
  access_token?: string;
  message?: string;
  [key: string]: unknown;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID ?? "";
const TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH ?? "";
const SCRIPT_URL = "https://verify.msg91.com/otp-provider.js";
const SCRIPT_ID = "msg91-otp-provider";

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMSG91() {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Guard: only load once, even across re-renders or StrictMode double-mounts
    if (initialized.current || document.getElementById(SCRIPT_ID)) {
      // Script already present — mark ready if methods exist
      if (typeof window.initSendOTP === "function") {
        setReady(true);
      } else {
        // Script tag exists but may still be loading; wait for it
        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => setReady(true));
        }
      }
      initialized.current = true;
      return;
    }
    initialized.current = true;

    const config: MSG91Config = {
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      success: (data: unknown) => {
        console.log("[MSG91 Config Success]", data);
      },
      failure: (err: unknown) => {
        console.error("[MSG91 Config Failure]", err);
      },
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "text/javascript";
    script.src = SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      if (typeof window.initSendOTP === "function") {
        window.initSendOTP(config);
        setReady(true);
      } else {
        console.error("[useMSG91] initSendOTP not found after script load.");
      }
    };

    script.onerror = () => {
      console.error("[useMSG91] Failed to load otp-provider.js from MSG91.");
    };

    document.body.appendChild(script);
    // Do not remove script on unmount — it's a global singleton
  }, []);

  // ── sendOtp ──────────────────────────────────────────────────────────────
  /** Send an OTP to the given phone number (format: 91XXXXXXXXXX for India). */
  const sendOtp = (phone: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (typeof window.sendOtp !== "function") {
        resolve({ success: false, error: "MSG91 widget not loaded yet. Please try again." });
        return;
      }
      window.sendOtp(
        phone,
        (_data: unknown) => {
          resolve({ success: true });
        },
        (err: unknown) => {
          const msg =
            typeof err === "string"
              ? err
              : (err as { message?: string })?.message ?? "Failed to send OTP. Please try again.";
          resolve({ success: false, error: msg });
        }
      );
    });
  };

  // ── verifyOtp ────────────────────────────────────────────────────────────
  /** Verify the OTP entered by the user. Returns the MSG91 access_token on success. */
  const verifyOtp = (
    otp: string
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (typeof window.verifyOtp !== "function") {
        resolve({ success: false, error: "MSG91 widget not loaded yet. Please try again." });
        return;
      }
      
      console.log(`[useMSG91] Calling window.verifyOtp with: ${otp}`);
      // Passing as string since docs say it expects string, but some widgets prefer Number.
      // We will pass it as string.
      window.verifyOtp(
        otp,
        (data: unknown) => {
          console.log("[useMSG91] verifyOtp SUCCESS callback:", data);
          
          let token = "";
          // Check if data is already the token string, or if it's an object
          if (typeof data === "string") {
            try {
              const parsed = JSON.parse(data);
              token = parsed.access_token || parsed.token || parsed.message || "";
            } catch {
              token = data; // the string might literally be the token
            }
          } else if (data && typeof data === "object") {
            const verified = data as MSG91VerifyData;
            token = verified.access_token || verified.message || "";
            
            // MSG91 sometimes passes type: 'error' in success callback
            if (verified.type === "error" || (verified.message && verified.message.toLowerCase().includes("incorrect"))) {
               console.warn("[useMSG91] MSG91 returned error in success callback");
               resolve({ success: false, error: verified.message || "Incorrect OTP. Please try again." });
               return;
            }
          }

          resolve({ success: true, accessToken: token });
        },
        (err: unknown) => {
          console.error("[useMSG91] verifyOtp FAILURE callback:", err);
          
          // Sometimes MSG91 calls failure but it actually succeeded if the response format was weird
          // Let's check if the error is actually a success message
          if (err && typeof err === "object") {
             const errObj = err as any;
             if (errObj.type === "success" || (errObj.message && errObj.message.toLowerCase().includes("verified"))) {
                console.warn("[useMSG91] MSG91 called failure callback but it seems verified");
                const token = errObj.access_token || errObj.message || "";
                resolve({ success: true, accessToken: token });
                return;
             }
          }
          
          const msg =
            typeof err === "string"
              ? err
              : (err as { message?: string })?.message ?? "Incorrect OTP. Please try again.";
          resolve({ success: false, error: msg });
        }
      );
    });
  };

  // ── retryOtp ─────────────────────────────────────────────────────────────
  /**
   * Resend OTP via the specified channel.
   * Pass `null` for default config, or channel code: '11' (SMS), '4' (Voice),
   * '3' (Email), '12' (WhatsApp).
   */
  const retryOtp = (
    channel: string | null = null
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (typeof window.retryOtp !== "function") {
        resolve({ success: false, error: "MSG91 widget not loaded yet. Please try again." });
        return;
      }
      window.retryOtp(
        channel,
        (_data: unknown) => {
          resolve({ success: true });
        },
        (err: unknown) => {
          const msg =
            typeof err === "string"
              ? err
              : (err as { message?: string })?.message ?? "Failed to resend OTP.";
          resolve({ success: false, error: msg });
        }
      );
    });
  };

  return { ready, sendOtp, verifyOtp, retryOtp };
}
