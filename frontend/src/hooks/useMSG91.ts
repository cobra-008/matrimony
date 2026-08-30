"use client";

// src/hooks/useMSG91.ts
//
// MSG91 OTP Widget integration using the official SDK pattern:
//   1. A <script> tag loads otp-provider.js with onload="initSendOTP(configuration)"
//   2. exposeMethods: true prevents the popup and exposes window.sendOtp,
//      window.verifyOtp, window.retryOtp on the window object
//   3. We inject the script once (singleton) and poll for window.sendOtp
//      because Angular bootstraps asynchronously after initSendOTP() is called.
//
// BUG FIXES:
//
// FIX-1: _injectScript() is now called INSIDE useEffect (after first DOM paint).
//   Previously it could be called before the captchaRenderId <div> was mounted,
//   causing the MSG91 Angular widget to fail to render hCaptcha and never
//   expose window.sendOtp → 15 s timeout fired every time.
//
// FIX-2: Added _failed flag + _reset() so singleton state is cleared after a
//   timeout. Previously _initPromise stayed permanently rejected and _injected
//   stayed true — every retry failed instantly without re-trying the network.
//
// FIX-3: _getInitPromise() is always called BEFORE _injectScript() so
//   _resolveInit / _rejectInit are non-null when script callbacks fire them.

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
export const CAPTCHA_DIV_ID   = "msg91-captcha-container";   // must exist in DOM
const INIT_TIMEOUT_MS  = 25_000;   // 25 s for script + Angular bootstrap (bumped from 15 s)
const METHOD_TIMEOUT_MS = 30_000;  // 30 s per sendOtp / verifyOtp / retryOtp

// True only when both env vars are present — export so pages can show a setup hint.
export const credentialsSet = Boolean(WIDGET_ID && TOKEN_AUTH);

// ── Module-level singleton ────────────────────────────────────────────────────
let _initPromise:  Promise<void>        | null = null;
let _resolveInit:  (() => void)         | null = null;
let _rejectInit:   ((e: Error) => void) | null = null;
let _injected = false;
let _failed   = false; // FIX-2: tracks permanent failure so we can reset

// FIX-2: Clears all singleton state so the hook can make a fresh attempt.
function _reset(): void {
  _initPromise  = null;
  _resolveInit  = null;
  _rejectInit   = null;
  _injected     = false;
  _failed       = false;
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

// FIX-1: captchaDiv is passed in (not read from the constant at module level)
// to guarantee the element is already in the DOM before initSendOTP() fires.
// This function must only be called from inside useEffect.
function _injectScript(captchaDiv: string): void {
  if (_injected) return;
  _injected = true;

  // Hot-reload guard: widget already bootstrapped from a previous render.
  // FIX-3: _resolveInit is guaranteed non-null because _getInitPromise() is
  // always called before _injectScript() in the useEffect below.
  if (typeof window.sendOtp === "function") {
    _resolveInit?.();
    return;
  }

  const timeoutId = setTimeout(() => {
    _failed = true; // FIX-2
    _rejectInit?.(
      new Error("MSG91 widget timed out. Please refresh the page and try again.")
    );
  }, INIT_TIMEOUT_MS);

  // Configuration object exactly as documented by MSG91
  const config: MSG91Config = {
    widgetId:        WIDGET_ID,
    tokenAuth:       TOKEN_AUTH,
    exposeMethods:   true,
    // FIX-1: captchaDiv is guaranteed mounted before this call (useEffect).
    // Routes hCaptcha path instead of grecaptcha.enterprise, which silently
    // hangs when reCAPTCHA Enterprise is blocked or unconfigured.
    captchaRenderId: captchaDiv,
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
      _failed = true; // FIX-2
      _rejectInit?.(new Error("MSG91 initSendOTP not found after script load."));
      return;
    }

    // Call initSendOTP exactly as the SDK specifies: initSendOTP(configuration)
    window.initSendOTP(config);

    // Poll for window.sendOtp — Angular bootstraps asynchronously
    let polls = 0;
    const pollId = setInterval(() => {
      polls++;
      if (typeof window.sendOtp === "function") {
        clearInterval(pollId);
        clearTimeout(timeoutId);
        _resolveInit?.();
      } else if (polls >= 250) {
        // 250 × 100 ms = 25 s (matches INIT_TIMEOUT_MS)
        clearInterval(pollId);
        clearTimeout(timeoutId);
        _failed = true; // FIX-2
        _rejectInit?.(
          new Error("MSG91 widget did not expose sendOtp after 25 seconds.")
        );
      }
    }, 100);
  };

  // Reuse an existing script tag if present (e.g. after a soft navigation)
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (typeof window.sendOtp === "function") {
      clearTimeout(timeoutId);
      _resolveInit?.();
    } else {
      existing.addEventListener("load", doInit, { once: true });
      existing.addEventListener("error", () => {
        clearTimeout(timeoutId);
        _failed = true; // FIX-2
        _rejectInit?.(new Error("Failed to load MSG91 otp-provider.js."));
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
    _failed = true; // FIX-2
    _rejectInit?.(new Error("Failed to load MSG91 otp-provider.js."));
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

    // GUARD: If credentials are missing, fail immediately with an actionable error
    // instead of silently waiting 25 s for the timeout.
    if (!credentialsSet) {
      const missingVars: string[] = [];
      if (!WIDGET_ID)  missingVars.push("NEXT_PUBLIC_MSG91_WIDGET_ID");
      if (!TOKEN_AUTH) missingVars.push("NEXT_PUBLIC_MSG91_TOKEN_AUTH");
      const msg = `MSG91 OTP widget is not configured. Add ${missingVars.join(" and ")} to .env.local and restart the dev server.`;
      console.error("[useMSG91]", msg);
      if (mountedRef.current) setInitError(msg);
      return () => { mountedRef.current = false; };
    }

    // FIX-2: If a previous attempt permanently failed, reset singleton state
    // so this mount makes a fresh network attempt rather than instantly failing.
    if (_failed) {
      _reset();
    }

    // FIX-3: Create the promise FIRST so _resolveInit / _rejectInit are
    // assigned before _injectScript()'s callbacks can fire them.
    const promise = _getInitPromise();

    // FIX-1: Inject here (inside useEffect = after first DOM paint) so the
    // captchaRenderId <div> is guaranteed mounted before initSendOTP() runs.
    _injectScript(CAPTCHA_DIV_ID);

    promise
      .then(() => { if (mountedRef.current) { setReady(true); setInitError(null); } })
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

