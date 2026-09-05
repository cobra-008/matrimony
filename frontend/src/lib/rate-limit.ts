/**
 * rate-limit.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side rate limiting for login attempts, persisted in cookies so that
 * a page refresh does NOT reset the attempt counter or lockout timer.
 *
 * Policy:
 *   - Password login: 5 failed attempts → 5-minute lockout. Every subsequent
 *     failure after a lockout expires also triggers another 5-minute lockout.
 *   - Cookie key: etm_rl_pw_{b64(identifier)}
 *
 * Cookie format (JSON):
 *   { attempts: number, lockedUntil: number | null }
 *   where lockedUntil is a Unix timestamp (ms) or null when not locked.
 */

export interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  /** ms until the lockout expires (0 when not locked) */
  remainingMs: number;
  attempts: number;
}

const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS_BEFORE_LOCK = 5;
/** Cookie lifetime in seconds — keep long enough to outlive the lockout window */
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a deterministic, URL-safe cookie key from an identifier (email / mobile).
 * We use a simple btoa encode — NOT a secret hash, just obfuscation + URL-safety.
 */
function cookieKey(identifier: string): string {
  const normalised = identifier.trim().toLowerCase();
  try {
    return `etm_rl_pw_${btoa(normalised).replace(/[+/=]/g, "_")}`;
  } catch {
    // fallback for very unusual characters
    return `etm_rl_pw_${encodeURIComponent(normalised).replace(/%/g, "_")}`;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Strict`;
}

// ── Read / Write state ────────────────────────────────────────────────────────

function readState(identifier: string): RateLimitState {
  const key = cookieKey(identifier);
  const raw = getCookie(key);
  if (!raw) return { attempts: 0, lockedUntil: null };
  try {
    const parsed = JSON.parse(raw) as Partial<RateLimitState>;
    return {
      attempts: typeof parsed.attempts === "number" ? parsed.attempts : 0,
      lockedUntil: typeof parsed.lockedUntil === "number" ? parsed.lockedUntil : null,
    };
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

function writeState(identifier: string, state: RateLimitState): void {
  const key = cookieKey(identifier);
  setCookie(key, JSON.stringify(state), COOKIE_MAX_AGE_SECONDS);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Check whether a login attempt is currently allowed for this identifier.
 * Call this BEFORE making the login API request.
 */
export function checkRateLimit(identifier: string): RateLimitCheckResult {
  if (!identifier) return { allowed: true, remainingMs: 0, attempts: 0 };

  const state = readState(identifier);
  const now = Date.now();

  // If currently locked
  if (state.lockedUntil !== null) {
    const remaining = state.lockedUntil - now;
    if (remaining > 0) {
      return { allowed: false, remainingMs: remaining, attempts: state.attempts };
    }
    // Lockout has expired — clear the lockedUntil but keep attempt count
    // so that the very next failure also triggers a lockout
    const newState: RateLimitState = { attempts: state.attempts, lockedUntil: null };
    writeState(identifier, newState);
    return { allowed: true, remainingMs: 0, attempts: newState.attempts };
  }

  return { allowed: true, remainingMs: 0, attempts: state.attempts };
}

/**
 * Record a FAILED login attempt. Returns the updated check result.
 * Call this AFTER a failed login response.
 */
export function recordFailedAttempt(identifier: string): RateLimitCheckResult {
  if (!identifier) return { allowed: true, remainingMs: 0, attempts: 0 };

  const state = readState(identifier);
  const newAttempts = state.attempts + 1;

  let lockedUntil: number | null = null;
  if (newAttempts >= MAX_ATTEMPTS_BEFORE_LOCK) {
    lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  const newState: RateLimitState = { attempts: newAttempts, lockedUntil };
  writeState(identifier, newState);

  if (lockedUntil !== null) {
    return { allowed: false, remainingMs: LOCKOUT_DURATION_MS, attempts: newAttempts };
  }
  return {
    allowed: true,
    remainingMs: 0,
    attempts: newAttempts,
  };
}

/**
 * Clear rate limit state on successful login.
 * Call this AFTER a successful login response.
 */
export function clearRateLimit(identifier: string): void {
  if (!identifier) return;
  deleteCookie(cookieKey(identifier));
}

/**
 * Format a millisecond duration as "M:SS" for display.
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Remaining attempts before a lockout.
 */
export function remainingAttempts(identifier: string): number {
  const state = readState(identifier);
  return Math.max(0, MAX_ATTEMPTS_BEFORE_LOCK - state.attempts);
}
