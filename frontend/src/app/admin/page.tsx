"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

// ── Types ──────────────────────────────────────────────────────────────────
type AdminSection =
  | "overview" | "users" | "verification"
  | "subscriptions" | "stories" | "notifications" | "reports";

// ── Helpers ────────────────────────────────────────────────────────────────
async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Login Form ─────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      onSuccess();
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #4A0F1C 0%, #6B1A2A 60%, #8B2535 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2.5rem 2rem", width: "100%", maxWidth: "380px", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #6B1A2A, #C8973A)", borderRadius: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5L12 1z" fill="white" opacity="0.9"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#6B1A2A", margin: 0 }}>Admin Portal</h1>
          <p style={{ fontSize: "0.8125rem", color: "#888", marginTop: "4px" }}>Elite Tamil Matrimony</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username" required
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              placeholder="Enter admin username"
            />
          </div>
          <div style={{ marginBottom: "1.25rem", position: "relative" }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#444", marginBottom: "6px" }}>Password</label>
            <input
              type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" required
              style={{ width: "100%", padding: "0.75rem 1rem", paddingRight: "3rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              placeholder="Enter admin password"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: "12px", bottom: "12px", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0 }}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {error && <div style={{ background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "#c62828", marginBottom: "1rem" }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.875rem", background: loading ? "#ccc" : "linear-gradient(135deg, #6B1A2A, #8B2535)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#bbb", marginTop: "1.5rem" }}>
          This portal is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const SECTIONS: { id: AdminSection; label: string; icon: string }[] = [
  { id: "overview",       label: "Overview",         icon: "📊" },
  { id: "users",          label: "Users",             icon: "👥" },
  { id: "verification",   label: "Verification",      icon: "✅" },
  { id: "subscriptions",  label: "Subscriptions",     icon: "💳" },
  { id: "stories",        label: "Success Stories",   icon: "💑" },
  { id: "notifications",  label: "Notifications",     icon: "🔔" },
  { id: "reports",        label: "Reports",           icon: "🚩" },
];

function Sidebar({ active, onSelect, onLogout }: { active: AdminSection; onSelect: (s: AdminSection) => void; onLogout: () => void }) {
  return (
    <aside style={{ width: "220px", flexShrink: 0, background: "#1a0a0e", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.5rem 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: "#C8973A", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.05em" }}>ELITE TAMIL</div>
        <div style={{ color: "#888", fontSize: "0.6875rem", letterSpacing: "0.1em" }}>ADMIN PORTAL</div>
      </div>
      <nav style={{ flex: 1, padding: "0.75rem 0" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => onSelect(s.id)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "0.75rem 1.25rem", background: active === s.id ? "rgba(107,26,42,0.7)" : "none", border: "none", borderLeft: active === s.id ? "3px solid #C8973A" : "3px solid transparent", color: active === s.id ? "#fff" : "#999", fontSize: "0.875rem", fontWeight: active === s.id ? 700 : 400, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
            <span style={{ fontSize: "1rem" }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} style={{ margin: "1rem", padding: "0.625rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#aaa", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit" }}>
        🚪 Sign Out
      </button>
    </aside>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "140px" }}>
      <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: color || "#1a1a1a" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "2px" }}>{sub}</div>}
    </div>
  );
}

// ── Overview Section ───────────────────────────────────────────────────────
function OverviewSection() {
  const [data, setData] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    api("/api/admin/data?type=overview").then(setData).catch(() => toast.error("Failed to load overview"));
  }, []);
  if (!data) return <LoadingSpinner />;
  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.5rem" }}>Dashboard Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Users" value={data.totalUsers} sub="all time" color="#6B1A2A" />
        <StatCard label="New Today" value={data.newToday} color="#1e7d32" />
        <StatCard label="Active Plans" value={data.activePlans} color="#C8973A" />
        <StatCard label="Pending Verify" value={data.pendingVerification} sub="requests" color="#e65100" />
        <StatCard label="Success Stories" value={data.successStories} />
        <StatCard label="Unread Alerts" value={data.unreadNotifications} />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "1rem" }}>Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {["Review Verifications →", "View All Users →", "Send Broadcast →", "Manage Stories →"].map((lbl, i) => (
            <div key={i} style={{ padding: "0.5rem 1rem", background: "#f5f5f5", borderRadius: "8px", fontSize: "0.875rem", color: "#6B1A2A", fontWeight: 600, cursor: "pointer" }}>{lbl}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Users Section ──────────────────────────────────────────────────────────
function UsersSection() {
  const [users, setUsers]   = useState<any[]>([]);
  const [total, setTotal]   = useState(0);
  const [q, setQ]           = useState("");
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/api/admin/data?type=users&q=${encodeURIComponent(q)}&page=${page}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch { toast.error("Failed to load users"); }
    setLoading(false);
  }, [q, page]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (u: any) => {
    const data = await api(`/api/admin/data?type=user_detail&id=${u.id}`);
    setSelected(data.user);
    setAdminNotes(data.user?.admin_notes || "");
    setShowDetail(true);
  };

  const banUser = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await api("/api/admin/data?action=ban_user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id, reason: banReason }) });
      toast.success("User banned"); setShowDetail(false); load();
    } catch { toast.error("Failed"); }
    setActionLoading(false);
  };

  const unbanUser = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await api("/api/admin/data?action=unban_user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id }) });
      toast.success("User unbanned"); setShowDetail(false); load();
    } catch { toast.error("Failed"); }
    setActionLoading(false);
  };

  const sendNotif = async () => {
    if (!selected || !notifTitle || !notifMsg) { toast.error("Fill all fields"); return; }
    setActionLoading(true);
    try {
      await api("/api/admin/data?action=send_notification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id, title: notifTitle, message: notifMsg }) });
      toast.success("Notification sent!"); setNotifTitle(""); setNotifMsg("");
    } catch { toast.error("Failed"); }
    setActionLoading(false);
  };

  const saveNotes = async () => {
    if (!selected) return;
    await api("/api/admin/data?action=update_admin_notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id, notes: adminNotes }) });
    toast.success("Notes saved");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Users ({total})</h2>
        <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search name, mobile, email…" style={{ padding: "0.625rem 1rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.875rem", width: "240px", fontFamily: "inherit", outline: "none" }} />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}>
                {["Name", "Mobile", "Gender", "Plan", "Verified", "Banned", "Joined", ""].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f0f0f0", background: u.is_banned ? "#fff5f5" : "#fff" }}>
                  <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: u.gender === "female" ? "#F5E6E9" : "#EAF0FA", flexShrink: 0, overflow: "hidden" }}>
                        {u.photo_url ? <img src={u.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem" }}>{u.gender === "female" ? "👩" : "👨"}</div>}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{u.mobile}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555", textTransform: "capitalize" }}>{u.gender || "—"}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "0.6875rem", fontWeight: 700, background: u.membership_plan ? "#FBF6EC" : "#f5f5f5", color: u.membership_plan ? "#C8973A" : "#aaa" }}>
                      {u.membership_plan || "Free"}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ color: u.is_verified ? "#2e7d32" : "#aaa", fontWeight: 600 }}>{u.is_verified ? "✓" : "—"}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {u.is_banned ? <span style={{ color: "#c62828", fontWeight: 700, fontSize: "0.75rem" }}>BANNED</span> : <span style={{ color: "#aaa" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#aaa" }}>{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <button onClick={() => loadDetail(u)} style={{ padding: "4px 12px", background: "#6B1A2A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0f0f0", fontSize: "0.8125rem", color: "#888" }}>
            <span>Page {page} · {total} total</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "4px 10px", background: page === 1 ? "#f5f5f5" : "#6B1A2A", color: page === 1 ? "#ccc" : "#fff", border: "none", borderRadius: "6px", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ padding: "4px 10px", background: page * 20 >= total ? "#f5f5f5" : "#6B1A2A", color: page * 20 >= total ? "#ccc" : "#fff", border: "none", borderRadius: "6px", cursor: page * 20 >= total ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetail && selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1.125rem", color: "#1a1a1a", margin: 0 }}>{selected.name}</h3>
              <button onClick={() => setShowDetail(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#aaa" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem", marginBottom: "1.25rem", fontSize: "0.8125rem" }}>
              {[["ID", selected.id?.slice(0, 16) + "…"], ["Mobile", selected.mobile], ["Email", selected.email || "—"], ["Gender", selected.gender || "—"], ["City", selected.city || "—"], ["State", selected.state || "—"], ["Plan", selected.membership_plan || "Free"], ["Expiry", selected.membership_expiry ? new Date(selected.membership_expiry).toLocaleDateString("en-IN") : "—"], ["Verified", selected.is_verified ? "Yes ✓" : "No"], ["Status", selected.is_banned ? "BANNED 🚫" : "Active"], ["Joined", new Date(selected.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })], ["Price Paid", selected.membership_price_paid ? `₹${selected.membership_price_paid}` : "—"]].map(([k, v]) => (
                <div key={k}><span style={{ color: "#888", display: "block", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{k}</span><span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span></div>
              ))}
            </div>

            {/* Send Notification */}
            <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem", color: "#333" }}>📢 Send Notification / Message</div>
              <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Notification title" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", marginBottom: "0.5rem", fontFamily: "inherit", fontSize: "0.875rem", boxSizing: "border-box", outline: "none" }} />
              <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Message body…" rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              <button onClick={sendNotif} disabled={actionLoading} style={{ marginTop: "0.5rem", padding: "0.5rem 1.25rem", background: "#6B1A2A", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem" }}>Send</button>
            </div>

            {/* Admin Notes */}
            <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem", color: "#333" }}>📝 Admin Notes</div>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes (not visible to user)" rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              <button onClick={saveNotes} style={{ marginTop: "0.5rem", padding: "0.5rem 1.25rem", background: "#444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem" }}>Save Notes</button>
            </div>

            {/* Ban/Unban */}
            <div style={{ background: selected.is_banned ? "#fff5f5" : "#fafafa", border: `1px solid ${selected.is_banned ? "#ffcdd2" : "#e8e8e8"}`, borderRadius: "10px", padding: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem", color: selected.is_banned ? "#c62828" : "#333" }}>
                {selected.is_banned ? "🚫 User is Banned" : "⚠️ Ban User"}
              </div>
              {!selected.is_banned && (
                <>
                  <input value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Reason for ban (optional)" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontFamily: "inherit", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", marginBottom: "0.5rem" }} />
                  <button onClick={banUser} disabled={actionLoading} style={{ padding: "0.5rem 1.25rem", background: "#c62828", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem" }}>Ban User</button>
                </>
              )}
              {selected.is_banned && (
                <button onClick={unbanUser} disabled={actionLoading} style={{ padding: "0.5rem 1.25rem", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem" }}>Unban User</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Verification Section ───────────────────────────────────────────────────
function VerificationSection() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [reason, setReason]     = useState("");

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/admin/data?type=verification"); setRequests(d.requests || []); }
    catch { toast.error("Failed to load"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const approve = async (userId: string) => {
    await api("/api/admin/data?action=approve_verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    toast.success("Approved ✓"); load();
  };
  const reject = async (userId: string) => {
    await api("/api/admin/data?action=reject_verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, reason }) });
    toast.success("Rejected"); load();
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Verification Requests ({requests.length})</h2>
      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>✅ No pending verification requests</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {requests.map(r => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f5e6e9", overflow: "hidden", flexShrink: 0 }}>
                {r.photo_url ? <img src={r.photo_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{r.gender === "female" ? "👩" : "👨"}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{r.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "#888" }}>{r.mobile} · {r.city || "—"} · {new Date(r.created_at).toLocaleDateString("en-IN")}</div>
                {r.verification_document && <div style={{ fontSize: "0.75rem", color: "#C8973A", marginTop: "2px" }}>Doc: {r.verification_document}</div>}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Rejection reason…" style={{ padding: "0.375rem 0.75rem", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "0.8125rem", fontFamily: "inherit", outline: "none", width: "180px" }} />
                <button onClick={() => approve(r.id)} style={{ padding: "0.5rem 1rem", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "0.8125rem", fontFamily: "inherit" }}>Approve</button>
                <button onClick={() => reject(r.id)} style={{ padding: "0.5rem 1rem", background: "#c62828", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "0.8125rem", fontFamily: "inherit" }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Subscriptions Section ──────────────────────────────────────────────────
function SubscriptionsSection() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/admin/data?type=subscriptions")
      .then(d => setSubs(d.subscriptions || []))
      .catch(() => toast.error("Failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const active = subs.filter(s => s.membership_expiry && new Date(s.membership_expiry) > new Date());
  const revenue = active.reduce((sum, s) => sum + (s.membership_price_paid || 0), 0);

  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Subscriptions ({subs.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total" value={subs.length} />
        <StatCard label="Active" value={active.length} color="#2e7d32" />
        <StatCard label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} color="#C8973A" />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}>
              {["Name", "Mobile", "Plan", "Period", "Amount Paid", "Activated", "Expires", "Status"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontWeight: 700, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs.map(s => {
              const isActive = s.membership_expiry && new Date(s.membership_expiry) > new Date();
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{s.mobile}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "0.6875rem", fontWeight: 700, background: "#FBF6EC", color: "#C8973A" }}>{s.membership_plan}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{s.membership_plan_period || "—"}</td>
                  <td style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#1a1a1a" }}>{s.membership_price_paid ? `₹${s.membership_price_paid.toLocaleString("en-IN")}` : "—"}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{s.membership_activated ? new Date(s.membership_activated).toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{s.membership_expiry ? new Date(s.membership_expiry).toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "0.6875rem", fontWeight: 700, background: isActive ? "#e8f5e9" : "#fafafa", color: isActive ? "#2e7d32" : "#aaa" }}>
                      {isActive ? "Active" : "Expired"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Success Stories Section ────────────────────────────────────────────────
function StoriesSection() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ name: "", city: "", married: "", story: "" });
  const [adding, setAdding]   = useState(false);

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/admin/data?type=success_stories"); setStories(d.stories || []); }
    catch { toast.error("Failed"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.story) { toast.error("Name and story required"); return; }
    setAdding(true);
    await api("/api/admin/data?action=add_success_story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success("Story added!"); setForm({ name: "", city: "", married: "", story: "" }); load();
    setAdding(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    await api("/api/admin/data?action=delete_success_story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Deleted"); load();
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Success Stories ({stories.length})</h2>

      {/* Add form */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "1rem" }}>➕ Add New Story</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          {[["name", "Couple Names (e.g. Priya & Karthik)"], ["city", "City"], ["married", "Married (e.g. March 2025)"]].map(([k, p]) => (
            <input key={k} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", gridColumn: k === "name" ? "1 / -1" : "auto" }} />
          ))}
        </div>
        <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} placeholder="Their story…" rows={3} style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", marginBottom: "0.75rem", boxSizing: "border-box", outline: "none" }} />
        <button onClick={add} disabled={adding} style={{ padding: "0.625rem 1.5rem", background: "#6B1A2A", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
          {adding ? "Adding…" : "Add Story"}
        </button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {stories.map(s => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ fontSize: "2rem", flexShrink: 0 }}>💑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{s.name}</div>
              <div style={{ fontSize: "0.8125rem", color: "#C8973A", fontWeight: 600 }}>{s.city} · {s.married}</div>
              <div style={{ fontSize: "0.8125rem", color: "#555", marginTop: "4px", lineHeight: 1.5 }}>{s.story}</div>
            </div>
            <button onClick={() => del(s.id)} style={{ padding: "4px 10px", background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "6px", color: "#c62828", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, fontFamily: "inherit", flexShrink: 0 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Broadcast Notifications Section ───────────────────────────────────────
function NotificationsSection() {
  const [title, setTitle]     = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget]   = useState("all");
  const [userId, setUserId]   = useState("");
  const [sending, setSending] = useState(false);
  const [log, setLog]         = useState<any[]>([]);

  useEffect(() => {
    api("/api/admin/data?type=notifications_log")
      .then(d => setLog(d.notifications || []))
      .catch(() => {});
  }, []);

  const send = async () => {
    if (!title || !message) { toast.error("Fill title and message"); return; }
    setSending(true);
    try {
      await api("/api/admin/data?action=send_notification", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: target === "all" ? "all" : userId, title, message }),
      });
      toast.success(target === "all" ? "Broadcast sent to all users!" : "Notification sent!");
      setTitle(""); setMessage("");
    } catch { toast.error("Failed to send"); }
    setSending(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Send Notifications</h2>

      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "1rem" }}>📢 Compose Notification</div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          {["all", "user"].map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0.5rem 1rem", border: `1.5px solid ${target === t ? "#6B1A2A" : "#e0e0e0"}`, borderRadius: "8px", background: target === t ? "#F5E6E9" : "#fff", fontSize: "0.875rem", fontWeight: target === t ? 700 : 500 }}>
              <input type="radio" name="target" value={t} checked={target === t} onChange={() => setTarget(t)} style={{ accentColor: "#6B1A2A" }} />
              {t === "all" ? "📢 Broadcast to ALL users" : "👤 Send to specific user"}
            </label>
          ))}
        </div>

        {target === "user" && (
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (UUID)" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }} />
        )}

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message body…" rows={4} style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", marginBottom: "1rem", boxSizing: "border-box", outline: "none" }} />

        <button onClick={send} disabled={sending} style={{ padding: "0.75rem 2rem", background: sending ? "#ccc" : "linear-gradient(135deg, #6B1A2A, #C8973A)", color: "#fff", border: "none", borderRadius: "8px", cursor: sending ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: "0.9375rem" }}>
          {sending ? "Sending…" : target === "all" ? "📢 Send Broadcast" : "Send Notification"}
        </button>
      </div>

      {log.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Recent Admin Notifications</div>
          {log.slice(0, 20).map(n => (
            <div key={n.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #f0f0f0", fontSize: "0.8125rem" }}>
              <div style={{ fontWeight: 600 }}>{n.title}</div>
              <div style={{ color: "#666", marginTop: "2px" }}>{n.body}</div>
              <div style={{ color: "#aaa", marginTop: "4px" }}>{new Date(n.created_at).toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reports Section ────────────────────────────────────────────────────────
function ReportsSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Reports & Flagged Profiles</h2>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🚩</div>
        <div style={{ fontWeight: 700, color: "#555" }}>No active reports</div>
        <div style={{ fontSize: "0.875rem", color: "#aaa", marginTop: "0.375rem" }}>Flagged profiles from users will appear here</div>
      </div>
    </div>
  );
}

// ── Loading Spinner ────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #e8e8e8", borderTop: "3px solid #6B1A2A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────
export default function AdminPage() {
  const [status, setStatus]     = useState<"loading" | "login" | "dashboard">("loading");
  const [section, setSection]   = useState<AdminSection>("overview");
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Verify session on mount
  useEffect(() => {
    fetch("/api/admin/verify-session")
      .then(r => r.json())
      .then(d => setStatus(d.valid ? "dashboard" : "login"))
      .catch(() => setStatus("login"));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("login");
    toast.success("Signed out");
  };

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#1a0a0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LoadingSpinner />
    </div>
  );

  if (status === "login") return <LoginForm onSuccess={() => setStatus("dashboard")} />;

  const SECTION_COMPONENTS: Record<AdminSection, React.ReactNode> = {
    overview:      <OverviewSection />,
    users:         <UsersSection />,
    verification:  <VerificationSection />,
    subscriptions: <SubscriptionsSection />,
    stories:       <StoriesSection />,
    notifications: <NotificationsSection />,
    reports:       <ReportsSection />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Lato', -apple-system, sans-serif" }}>
      {/* Sidebar — desktop */}
      <div style={{ display: "none" }} className="admin-sidebar-desktop">
        <Sidebar active={section} onSelect={(s) => { setSection(s); setMobileSidebar(false); }} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }} onClick={() => setMobileSidebar(false)}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "220px" }} onClick={e => e.stopPropagation()}>
            <Sidebar active={section} onSelect={(s) => { setSection(s); setMobileSidebar(false); }} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 1.5rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Hamburger (mobile) */}
            <button onClick={() => setMobileSidebar(v => !v)} className="admin-hamburger" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
              <div style={{ width: "20px", height: "2px", background: "#333", marginBottom: "4px" }}/>
              <div style={{ width: "20px", height: "2px", background: "#333", marginBottom: "4px" }}/>
              <div style={{ width: "20px", height: "2px", background: "#333" }}/>
            </button>
            <div style={{ fontWeight: 800, color: "#6B1A2A", fontSize: "1rem" }}>
              {SECTIONS.find(s => s.id === section)?.icon} {SECTIONS.find(s => s.id === section)?.label}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8125rem", color: "#888" }}>Admin</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #6B1A2A, #C8973A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>A</div>
          </div>
        </header>

        {/* Section content */}
        <main style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
          {SECTION_COMPONENTS[section]}
        </main>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-hamburger { display: none !important; }
        }
        @media (max-width: 899px) {
          .admin-sidebar-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}
