"use client";

// src/hooks/useMSG91.ts
// Loads the MSG91 OTP widget (otp-provider.js) and exposes its methods as
// async wrappers. Uses `exposeMethods: true` — your own UI handles the OTP
// input; no MSG91 popup appears.
//
// KEY DESIGN: The module-level _initPromise is shared across ALL hook instances
// (including React StrictMode double-mounts). Every method awaits this promise
// before calling window.*, so clicking "Send OTP" before the script finishes
// loading will simply wait rather than fail immediately.

import { useEffect, useRef, useState } from "react";

// ── Global type declarations ──────────────────────────────────────────────────
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

interface MSG91ResponseData {
  access_token?: string;
  message?: string;
  type?: string;
  [key: string]: unknown;
}

// ── Environment variables ─────────────────────────────────────────────────────
const WIDGET_ID   = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID   ?? "";
const TOKEN_AUTH  = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH  ?? "";
const SCRIPT_URL  = "https://verify.msg91.com/otp-provider.js";
const SCRIPT_ID   = "msg91-otp-provider";
const INIT_TIMEOUT_MS = 15_000; // 15 s — generous enough for slow networks

// ── Module-level singleton ────────────────────────────────────────────────────
// Shared state so the script is injected exactly once even with StrictMode.
let _initPromise: Promise<void> | null = null;
let _resolveInit: (() => void)        | null = null;
let _rejectInit:  ((e: Error) => void)| null = null;
let _injected = false;

function _getInitPromise(): Promise<void> {
  if (!_initPromise) {
    _initPromise = new Promise<void>((resolve, reject) => {
      _resolveInit = resolve;
      _rejectInit  = reject;
    });
  }
  return _initPromise;
}

function _injectScript(): void {
  if (_injected) return;
  _injected = true;

  // If widget is already initialized from a previous page load (e.g. hot-reload)
  if (typeof window.sendOtp === "function") {
    _resolveInit?.();
    return;
  }

  const timeoutId = setTimeout(() => {
    _rejectInit?.(
      new Error(
        "MSG91 widget took too long to load. Please check your connection and refresh."
      )
    );
  }, INIT_TIMEOUT_MS);

  const config: MSG91Config = {
    widgetId:      WIDGET_ID,
    tokenAuth:     TOKEN_AUTH,
    exposeMethods: true,
  };

  // Reuse an existing script tag if another code path already added it
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (typeof window.sendOtp === "function") {
      clearTimeout(timeoutId);
      _resolveInit?.();
    } else {
      existing.addEventListener("load", () => {
        clearTimeout(timeoutId);
        if (typeof window.initSendOTP === "function") window.initSendOTP(config);
        _resolveInit?.();
      });
      existing.addEventListener("error", () => {
        clearTimeout(timeoutId);
        _rejectInit?.(new Error("Failed to load MSG91 OTP widget script."));
      });
    }
    return;
  }

  const script = document.createElement("script");
  script.id    = SCRIPT_ID;
  script.type  = "text/javascript";
  script.src   = SCRIPT_URL;
  script.async = true;

  script.onload = () => {
    clearTimeout(timeoutId);
    if (typeof window.initSendOTP === "function") {
      window.initSendOTP(config);
      _resolveInit?.();
    } else {
      _rejectInit?.(
        new Error("MSG91 initSendOTP was not defined after script loaded.")
      );
    }
  };

  script.onerror = () => {
    clearTimeout(timeoutId);
    _rejectInit?.(new Error("Failed to load MSG91 OTP widget script."));
  };

  document.body.appendChild(script);
}

// ── Await-helper used by every method ────────────────────────────────────────
async function _awaitWidget(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await _getInitPromise();
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "MSG91 widget failed to load.";
    return { ok: false, error: msg };
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMSG91() {
  const [ready, setReady]     = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const mountedRef             = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Kick off script injection (idempotent)
    _injectScript();

    // Reflect init state in component
    _getInitPromise()
      .then(() => {
        if (mountedRef.current) setReady(true);
      })
      .catch((err: Error) => {
        if (mountedRef.current) setInitError(err.message);
      });

    return () => { mountedRef.current = false; };
  }, []);

  // ── sendOtp ──────────────────────────────────────────────────────────────
  /**
   * Send an OTP to `phone`.
   * Format for India: "91XXXXXXXXXX" (country code + 10-digit number, no "+").
   */
  const sendOtp = async (
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return new Promise((resolve) => {
      window.sendOtp(
        phone,
        () => resolve({ success: true }),
        (err: unknown) => {
          const d = toData(err);
          resolve({ success: false, error: d.message ?? "Failed to send OTP." });
        }
      );
    });
  };

  // ── verifyOtp ────────────────────────────────────────────────────────────
  /**
   * Verify the OTP entered by the user.
   * On success, MSG91 returns a JWT `access_token` for server-side verification.
   */
  const verifyOtp = async (
    otp: string
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return new Promise((resolve) => {
      window.verifyOtp(
        otp,
        (data: unknown) => {
          const d = toData(data);
          // MSG91 occasionally routes errors through the success callback
          if (d.type === "error") {
            resolve({ success: false, error: d.message ?? "OTP verification failed." });
            return;
          }
          resolve({ success: true, accessToken: d.access_token ?? "" });
        },
        (err: unknown) => {
          const d = toData(err);
          // MSG91 occasionally routes success through the failure callback
          if (d.type === "success" || d.access_token) {
            resolve({ success: true, accessToken: d.access_token ?? "" });
            return;
          }
          resolve({ success: false, error: d.message ?? "Incorrect OTP. Please try again." });
        }
      );
    });
  };

  // ── retryOtp ─────────────────────────────────────────────────────────────
  /**
   * Resend OTP via the specified channel.
   * `null` = widget default (SMS). Other values: '11' SMS, '4' Voice,
   * '3' Email, '12' WhatsApp.
   */
  const retryOtp = async (
    channel: string | null = null
  ): Promise<{ success: boolean; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return new Promise((resolve) => {
      window.retryOtp(
        channel,
        () => resolve({ success: true }),
        (err: unknown) => {
          const d = toData(err);
          resolve({ success: false, error: d.message ?? "Failed to resend OTP." });
        }
      );
    });
  };

  return { ready, initError, sendOtp, verifyOtp, retryOtp };
}

// ── Utility ───────────────────────────────────────────────────────────────────
function toData(value: unknown): MSG91ResponseData {
  if (!value) return {};
  if (typeof value === "string") {
    try { return JSON.parse(value) as MSG91ResponseData; }
    catch { return { message: value }; }
  }
  return value as MSG91ResponseData;
}
