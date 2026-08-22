"use client";

// src/hooks/useMSG91.ts
//
// KEY DESIGN DECISIONS (informed by reading otp-provider.js source):
//
// 1. `window.initSendOTP(config)` bootstraps an Angular app asynchronously.
//    `window.sendOtp` is only exposed AFTER `exposeMethodsToWindow()` runs
//    inside Angular's ngOnInit. We must POLL for it — resolving immediately
//    after calling initSendOTP is too early.
//
// 2. When `exposeMethods: true` and NO `captchaRenderId` is supplied, the
//    widget routes through `grecaptcha.enterprise.execute()`. If reCAPTCHA
//    Enterprise is blocked or misconfigured (common on custom domains), the
//    callback never fires — causing infinite "Sending…". Providing a real
//    DOM element as `captchaRenderId` routes through the hCaptcha widget
//    path instead, which is more reliable.
//
// 3. Every public method (sendOtp / verifyOtp / retryOtp) has a hard 30-second
//    timeout so the UI can never get permanently stuck.

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

export interface MSG91Config {
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

// ── Constants ─────────────────────────────────────────────────────────────────
const WIDGET_ID        = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID   ?? "";
const TOKEN_AUTH       = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH  ?? "";
const SCRIPT_URL       = "https://verify.msg91.com/otp-provider.js";
const SCRIPT_ID        = "msg91-otp-provider";
const CAPTCHA_DIV_ID   = "msg91-captcha-container";   // must exist in DOM
const INIT_TIMEOUT_MS  = 15_000;   // 15 s for script + Angular bootstrap
const METHOD_TIMEOUT_MS = 30_000;  // 30 s per sendOtp / verifyOtp / retryOtp

// ── Module-level singleton ────────────────────────────────────────────────────
let _initPromise: Promise<void> | null = null;
let _resolveInit: (() => void)         | null = null;
let _rejectInit:  ((e: Error) => void) | null = null;
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

  // Hot-reload guard: widget already bootstrapped
  if (typeof window.sendOtp === "function") {
    _resolveInit?.();
    return;
  }

  const timeoutId = setTimeout(() => {
    _rejectInit?.(
      new Error("MSG91 widget timed out. Please refresh the page and try again.")
    );
  }, INIT_TIMEOUT_MS);

  const config: MSG91Config = {
    widgetId:       WIDGET_ID,
    tokenAuth:      TOKEN_AUTH,
    exposeMethods:  true,
    // Providing a real captchaRenderId routes through hCaptcha widget path
    // and avoids the grecaptcha.enterprise path which silently hangs in
    // production when reCAPTCHA Enterprise is blocked or not configured.
    captchaRenderId: CAPTCHA_DIV_ID,
  };

  const doInit = () => {
    if (typeof window.initSendOTP !== "function") {
      clearTimeout(timeoutId);
      _rejectInit?.(new Error("MSG91 initSendOTP not found after script load."));
      return;
    }

    window.initSendOTP(config);

    // POLL until Angular's ngOnInit exposes window.sendOtp (async bootstrap).
    // Calling resolve() immediately after initSendOTP() is too early.
    let polls = 0;
    const pollId = setInterval(() => {
      polls++;
      if (typeof window.sendOtp === "function") {
        clearInterval(pollId);
        clearTimeout(timeoutId);
        _resolveInit?.();
      } else if (polls >= 150) {
        // 150 × 100 ms = 15 s
        clearInterval(pollId);
        clearTimeout(timeoutId);
        _rejectInit?.(
          new Error("MSG91 widget did not expose sendOtp after 15 seconds.")
        );
      }
    }, 100);
  };

  // Reuse an existing script tag if present
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (typeof window.sendOtp === "function") {
      clearTimeout(timeoutId);
      _resolveInit?.();
    } else {
      existing.addEventListener("load", doInit);
      existing.addEventListener("error", () => {
        clearTimeout(timeoutId);
        _rejectInit?.(new Error("Failed to load MSG91 otp-provider.js."));
      });
    }
    return;
  }

  const script = document.createElement("script");
  script.id    = SCRIPT_ID;
  script.type  = "text/javascript";
  script.src   = SCRIPT_URL;
  script.async = true;
  script.onload  = doInit;
  script.onerror = () => {
    clearTimeout(timeoutId);
    _rejectInit?.(new Error("Failed to load MSG91 otp-provider.js."));
  };

  document.body.appendChild(script);
}

// ── Await helper with error unwrapping ───────────────────────────────────────
async function _awaitWidget(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await _getInitPromise();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "MSG91 failed to load." };
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

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMSG91() {
  const [ready, setReady]         = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const mountedRef                = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    _injectScript();
    _getInitPromise()
      .then(() => { if (mountedRef.current) setReady(true); })
      .catch((err: Error) => { if (mountedRef.current) setInitError(err.message); });
    return () => { mountedRef.current = false; };
  }, []);

  // ── sendOtp ──────────────────────────────────────────────────────────────
  const sendOtp = async (
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    const w = await _awaitWidget();
    if (!w.ok) return { success: false, error: w.error };

    return withTimeout(
      METHOD_TIMEOUT_MS,
      new Promise<{ success: boolean; error?: string }>((resolve) => {
        window.sendOtp(
          phone,
          () => resolve({ success: true }),
          (err) => {
            const d = toData(err);
            resolve({ success: false, error: d.message ?? "Failed to send OTP." });
          }
        );
      }),
      "Sending OTP timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  // ── verifyOtp ────────────────────────────────────────────────────────────
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
            const d = toData(data);
            if (d.type === "error") {
              resolve({ success: false, error: d.message ?? "OTP verification failed." });
              return;
            }
            resolve({ success: true, accessToken: d.access_token ?? "" });
          },
          (err) => {
            const d = toData(err);
            if (d.type === "success" || d.access_token) {
              resolve({ success: true, accessToken: d.access_token ?? "" });
              return;
            }
            resolve({ success: false, error: d.message ?? "Incorrect OTP. Please try again." });
          }
        );
      }),
      "OTP verification timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  // ── retryOtp ─────────────────────────────────────────────────────────────
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
          () => resolve({ success: true }),
          (err) => {
            const d = toData(err);
            resolve({ success: false, error: d.message ?? "Failed to resend OTP." });
          }
        );
      }),
      "Resend OTP timed out. Please try again."
    ).catch((err: Error) => ({ success: false as const, error: err.message }));
  };

  return { ready, initError, sendOtp, verifyOtp, retryOtp };
}

// ── Captcha container div ID — import this in pages that use OTP ──────────────
export { CAPTCHA_DIV_ID };

// ── Utility ───────────────────────────────────────────────────────────────────
function toData(value: unknown): MSG91ResponseData {
  if (!value) return {};
  if (typeof value === "string") {
    try { return JSON.parse(value) as MSG91ResponseData; }
    catch { return { message: value }; }
  }
  return value as MSG91ResponseData;
}
