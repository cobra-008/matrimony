"use client";

// src/hooks/useMSG91.ts
//
// MSG91 OTP Widget integration using the official SDK pattern:
//   1. A <script> tag loads otp-provider.js with onload="initSendOTP(configuration)"
//   2. exposeMethods: true prevents the popup and exposes window.sendOtp,
//      window.verifyOtp, window.retryOtp on the window object
//   3. We inject the script once (singleton) and poll for window.sendOtp
//      because Angular bootstraps asynchronously after initSendOTP() is called.

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
  identifier?: string;
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

// ── Constants ─────────────────────────────────────────────────────────────────
const WIDGET_ID        = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID  ?? "";
const TOKEN_AUTH       = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH ?? "";
const SCRIPT_URL       = "https://verify.msg91.com/otp-provider.js";
const SCRIPT_ID        = "msg91-otp-provider";
const INIT_TIMEOUT_MS  = 20_000; // 20 s for script + Angular bootstrap
const METHOD_TIMEOUT_MS = 30_000; // 30 s per sendOtp / verifyOtp / retryOtp

// ── Module-level singleton ────────────────────────────────────────────────────
let _initPromise:  Promise<void>        | null = null;
let _resolveInit:  (() => void)         | null = null;
let _rejectInit:   ((e: Error) => void) | null = null;
let _injected = false;

function _resetSingleton(): void {
  _initPromise = null;
  _resolveInit = null;
  _rejectInit  = null;
  _injected    = false;
  const old = document.getElementById(SCRIPT_ID);
  if (old) old.remove();
}

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

  // Already bootstrapped (e.g. hot-reload)
  if (typeof window.sendOtp === "function") {
    _resolveInit?.();
    return;
  }

  const rejectAndReset = (err: Error) => {
    _rejectInit?.(err);
    setTimeout(_resetSingleton, 0);
  };

  const timeoutId = setTimeout(() => {
    rejectAndReset(
      new Error("MSG91 widget timed out. Please refresh the page and try again.")
    );
  }, INIT_TIMEOUT_MS);

  // Configuration object exactly as documented by MSG91
  const config: MSG91Config = {
    widgetId:      WIDGET_ID,
    tokenAuth:     TOKEN_AUTH,
    exposeMethods: true,
    success: (data) => {
      console.log("[MSG91] success callback", data);
    },
    failure: (error) => {
      console.log("[MSG91] failure callback", error);
    },
  };

  const doInit = () => {
    if (typeof window.initSendOTP !== "function") {
      clearTimeout(timeoutId);
      rejectAndReset(new Error("MSG91 initSendOTP not found after script load."));
      return;
    }

    // Call initSendOTP exactly as the SDK specifies: initSendOTP(configuration)
    window.initSendOTP(config);

    // Poll for window.sendOtp — Angular bootstraps asynchronously
    let polls = 0;
    const maxPolls = INIT_TIMEOUT_MS / 100;
    const pollId = setInterval(() => {
      polls++;
      if (typeof window.sendOtp === "function") {
        clearInterval(pollId);
        clearTimeout(timeoutId);
        _resolveInit?.();
      } else if (polls >= maxPolls) {
        clearInterval(pollId);
        clearTimeout(timeoutId);
        rejectAndReset(
          new Error("MSG91 widget did not expose sendOtp after 20 seconds.")
        );
      }
    }, 100);
  };

  // Reuse existing script tag (e.g. hot-reload)
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (typeof window.sendOtp === "function") {
      clearTimeout(timeoutId);
      _resolveInit?.();
    } else {
      existing.addEventListener("load", doInit, { once: true });
      existing.addEventListener("error", () => {
        clearTimeout(timeoutId);
        rejectAndReset(new Error("Failed to load MSG91 otp-provider.js."));
      }, { once: true });
    }
    return;
  }

  // Inject the script — MSG91 SDK pattern: onload calls initSendOTP(configuration)
  const script = document.createElement("script");
  script.id      = SCRIPT_ID;
  script.type    = "text/javascript";
  script.src     = SCRIPT_URL;
  script.async   = true;
  script.onload  = doInit;
  script.onerror = () => {
    clearTimeout(timeoutId);
    rejectAndReset(new Error("Failed to load MSG91 otp-provider.js."));
  };

  document.body.appendChild(script);
}

// ── Await helper ──────────────────────────────────────────────────────────────
async function _awaitWidget(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await _getInitPromise();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "MSG91 failed to load.",
    };
  }
}

// ── Per-call timeout wrapper ─────────────────────────────────────────────────
function withTimeout<T>(
  ms: number,
  promise: Promise<T>,
  msg = "Request timed out. Please try again."
): Promise<T> {
  let timerId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => reject(new Error(msg)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId));
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

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMSG91() {
  const [ready, setReady]         = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const mountedRef                = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setInitError(null);
    _injectScript();
    _getInitPromise()
      .then(() => { if (mountedRef.current) setReady(true); })
      .catch((err: Error) => { if (mountedRef.current) setInitError(err.message); });
    return () => { mountedRef.current = false; };
  }, []);

  // ── sendOtp ──────────────────────────────────────────────────────────────
  // Sends an OTP to the given identifier (email or mobile with country code, no '+')
  // Calls: window.sendOtp(identifier, successCb, failureCb)
  const sendOtp = async (
    identifier: string
  ): Promise<{ success: boolean; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return withTimeout(
      METHOD_TIMEOUT_MS,
      new Promise<{ success: boolean; error?: string }>((resolve) => {
        window.sendOtp(
          identifier,
          (data) => {
            console.log("[MSG91] sendOtp success", data);
            resolve({ success: true });
          },
          (error) => {
            console.log("[MSG91] sendOtp failure", error);
            const d = toData(error);
            resolve({ success: false, error: d.message ?? "Failed to send OTP." });
          }
        );
      }),
      "Sending OTP timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  // ── verifyOtp ────────────────────────────────────────────────────────────
  // Verifies the OTP entered by the user.
  // Calls: window.verifyOtp(otp, successCb, failureCb)
  const verifyOtp = async (
    otp: string
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return withTimeout(
      METHOD_TIMEOUT_MS,
      new Promise<{ success: boolean; accessToken?: string; error?: string }>((resolve) => {
        window.verifyOtp(
          otp,
          (data) => {
            console.log("[MSG91] verifyOtp success", data);
            const d = toData(data);
            if (d.type === "error") {
              resolve({ success: false, error: d.message ?? "OTP verification failed." });
              return;
            }
            resolve({ success: true, accessToken: d.access_token ?? "" });
          },
          (error) => {
            console.log("[MSG91] verifyOtp failure", error);
            const d = toData(error);
            // Some MSG91 widget versions fire the success data in the failure callback
            if (d.type === "success" || d.access_token) {
              resolve({ success: true, accessToken: d.access_token ?? "" });
              return;
            }
            resolve({
              success: false,
              error: d.message ?? "Incorrect OTP. Please try again.",
            });
          }
        );
      }),
      "OTP verification timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  // ── retryOtp ─────────────────────────────────────────────────────────────
  // Retries OTP delivery on a given channel.
  // channel: null for default, '11'=SMS, '4'=Voice, '3'=Email, '12'=WhatsApp
  // Calls: window.retryOtp(channel, successCb, failureCb)
  const retryOtp = async (
    channel: string | null = null
  ): Promise<{ success: boolean; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return withTimeout(
      METHOD_TIMEOUT_MS,
      new Promise<{ success: boolean; error?: string }>((resolve) => {
        window.retryOtp(
          channel,
          (data) => {
            console.log("[MSG91] retryOtp success", data);
            resolve({ success: true });
          },
          (error) => {
            console.log("[MSG91] retryOtp failure", error);
            const d = toData(error);
            resolve({ success: false, error: d.message ?? "Failed to resend OTP." });
          }
        );
      }),
      "Resend OTP timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  return { ready, initError, sendOtp, verifyOtp, retryOtp };
}

// Exported for backwards compatibility (captcha div no longer needed with default config)
export const CAPTCHA_DIV_ID = "msg91-captcha-container";
