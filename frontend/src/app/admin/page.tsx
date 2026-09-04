"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CreditCard,
  Heart,
  Bell,
  Flag,
  LogOut,
  Plus,
  Trash2,
  Send,
  FileText,
  Ban,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  Menu,
  Sparkles,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  ShieldAlert,
  Radio,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type AdminSection =
  | "overview"
  | "users"
  | "verification"
  | "subscriptions"
  | "stories"
  | "notifications"
  | "reports";

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
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #6B1A2A, #C8973A)", borderRadius: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem", color: "#fff" }}>
            <ShieldCheck size={28} />
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
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{ position: "absolute", right: "12px", bottom: "10px", background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px", display: "flex", alignItems: "center" }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
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
const SECTIONS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: "overview",       label: "Overview",         icon: <LayoutDashboard size={18} /> },
  { id: "users",          label: "Users",             icon: <Users size={18} /> },
  { id: "verification",   label: "Verification",      icon: <ShieldCheck size={18} /> },
  { id: "subscriptions",  label: "Subscriptions",     icon: <CreditCard size={18} /> },
  { id: "stories",        label: "Success Stories",   icon: <Heart size={18} /> },
  { id: "notifications",  label: "Notifications",     icon: <Bell size={18} /> },
  { id: "reports",        label: "Reports",           icon: <Flag size={18} /> },
];

function Sidebar({ active, onSelect, onLogout }: { active: AdminSection; onSelect: (s: AdminSection) => void; onLogout: () => void }) {
  return (
    <aside style={{ width: "230px", flexShrink: 0, background: "#1a0a0e", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: "#C8973A", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.05em" }}>ELITE TAMIL</div>
        <div style={{ color: "#888", fontSize: "0.6875rem", letterSpacing: "0.1em" }}>ADMIN PORTAL</div>
      </div>
      <nav style={{ flex: 1, padding: "0.75rem 0" }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "0.75rem 1.25rem",
              background: active === s.id ? "rgba(107,26,42,0.75)" : "none",
              border: "none",
              borderLeft: active === s.id ? "3px solid #C8973A" : "3px solid transparent",
              color: active === s.id ? "#fff" : "#aaa",
              fontSize: "0.875rem",
              fontWeight: active === s.id ? 700 : 400,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", color: active === s.id ? "#C8973A" : "#888" }}>
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
        style={{
          margin: "1rem",
          padding: "0.625rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          color: "#aaa",
          fontSize: "0.8125rem",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }: { label: string; value: number | string; sub?: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "140px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        {icon && <div style={{ color: color || "#888", opacity: 0.7 }}>{icon}</div>}
      </div>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Users" value={data.totalUsers} sub="all time" color="#6B1A2A" icon={<Users size={20} />} />
        <StatCard label="New Today" value={data.newToday} color="#1e7d32" icon={<Clock size={20} />} />
        <StatCard label="Active Plans" value={data.activePlans} color="#C8973A" icon={<CreditCard size={20} />} />
        <StatCard label="Pending Verify" value={data.pendingVerification} sub="requests" color="#e65100" icon={<ShieldAlert size={20} />} />
        <StatCard label="Success Stories" value={data.successStories} icon={<Heart size={20} />} />
        <StatCard label="Unread Alerts" value={data.unreadNotifications} icon={<Bell size={20} />} />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "1rem" }}>System Status</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.5rem 1rem", background: "#f5f5f5", borderRadius: "8px", fontSize: "0.875rem", color: "#6B1A2A", fontWeight: 600 }}>
            <CheckCircle2 size={16} style={{ color: "#2e7d32" }} /> Database Online &amp; Synchronized
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.5rem 1rem", background: "#f5f5f5", borderRadius: "8px", fontSize: "0.875rem", color: "#6B1A2A", fontWeight: 600 }}>
            <ShieldCheck size={16} style={{ color: "#C8973A" }} /> RLS Security Enabled
          </div>
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
        <div style={{ position: "relative" }}>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Search name, mobile, email…"
            style={{ padding: "0.625rem 1rem 0.625rem 2.25rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "0.875rem", width: "240px", fontFamily: "inherit", outline: "none" }}
          />
          <Search size={15} style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
        </div>
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
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: u.gender === "female" ? "#F5E6E9" : "#EAF0FA", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {u.photo_url ? (
                          <img src={u.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <UserIcon size={16} style={{ color: u.gender === "female" ? "#6B1A2A" : "#1A3A6B", opacity: 0.6 }} />
                        )}
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
                    {u.is_verified ? (
                      <span style={{ color: "#2e7d32", display: "inline-flex", alignItems: "center", gap: "2px", fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {u.is_banned ? (
                      <span style={{ color: "#c62828", fontWeight: 700, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Ban size={12} /> BANNED
                      </span>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
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
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "4px 10px", background: page === 1 ? "#f5f5f5" : "#6B1A2A", color: page === 1 ? "#ccc" : "#fff", border: "none", borderRadius: "6px", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * 20 >= total}
                style={{ padding: "4px 10px", background: page * 20 >= total ? "#f5f5f5" : "#6B1A2A", color: page * 20 >= total ? "#ccc" : "#fff", border: "none", borderRadius: "6px", cursor: page * 20 >= total ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "4px" }}
              >
                Next <ChevronRight size={14} />
              </button>
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
              <button onClick={() => setShowDetail(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem", marginBottom: "1.25rem", fontSize: "0.8125rem" }}>
              {[["ID", selected.id?.slice(0, 16) + "…"], ["Mobile", selected.mobile], ["Email", selected.email || "—"], ["Gender", selected.gender || "—"], ["City", selected.city || "—"], ["State", selected.state || "—"], ["Plan", selected.membership_plan || "Free"], ["Expiry", selected.membership_expiry ? new Date(selected.membership_expiry).toLocaleDateString("en-IN") : "—"], ["Verified", selected.is_verified ? "Yes" : "No"], ["Status", selected.is_banned ? "Banned" : "Active"], ["Joined", new Date(selected.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })], ["Price Paid", selected.membership_price_paid ? `₹${selected.membership_price_paid}` : "—"]].map(([k, v]) => (
                <div key={k}><span style={{ color: "#888", display: "block", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{k}</span><span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span></div>
              ))}
            </div>

            {/* Send Notification */}
            <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                <Send size={15} style={{ color: "#6B1A2A" }} /> Send Notification / Message
              </div>
              <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Notification title" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", marginBottom: "0.5rem", fontFamily: "inherit", fontSize: "0.875rem", boxSizing: "border-box", outline: "none" }} />
              <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Message body…" rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              <button onClick={sendNotif} disabled={actionLoading} style={{ marginTop: "0.5rem", padding: "0.5rem 1.25rem", background: "#6B1A2A", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Send size={13} /> Send
              </button>
            </div>

            {/* Admin Notes */}
            <div style={{ background: "#f9f9f9", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={15} style={{ color: "#444" }} /> Admin Notes
              </div>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes (not visible to user)" rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              <button onClick={saveNotes} style={{ marginTop: "0.5rem", padding: "0.5rem 1.25rem", background: "#444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.8125rem" }}>Save Notes</button>
            </div>

            {/* Ban/Unban */}
            <div style={{ background: selected.is_banned ? "#fff5f5" : "#fafafa", border: `1px solid ${selected.is_banned ? "#ffcdd2" : "#e8e8e8"}`, borderRadius: "10px", padding: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.5rem", color: selected.is_banned ? "#c62828" : "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                {selected.is_banned ? <Ban size={15} /> : <AlertTriangle size={15} />}
                {selected.is_banned ? "User is Banned" : "Ban User"}
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
    toast.success("Approved"); load();
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
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", background: "#fff", borderRadius: "12px", border: "1px solid #e8e8e8" }}>
          <CheckCircle2 size={36} style={{ color: "#2e7d32", margin: "0 auto 0.75rem", opacity: 0.8 }} />
          <div>No pending verification requests</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {requests.map(r => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f5e6e9", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {r.photo_url ? (
                  <img src={r.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <UserIcon size={22} style={{ color: "#6B1A2A", opacity: 0.6 }} />
                )}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Subscriptions" value={subs.length} icon={<CreditCard size={20} />} />
        <StatCard label="Active Subscriptions" value={active.length} color="#2e7d32" icon={<CheckCircle2 size={20} />} />
        <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} color="#C8973A" icon={<Sparkles size={20} />} />
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
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [adding, setAdding]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/admin/data?type=success_stories"); setStories(d.stories || []); }
    catch { toast.error("Failed to load success stories"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size must be under 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      // Read as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api("/api/admin/data?action=upload_story_photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileBase64: base64,
              fileName: file.name,
              contentType: file.type,
            }),
          });
          if (res.url) {
            setPhotoUrl(res.url);
            toast.success("Photo uploaded to storage!");
          } else {
            toast.error(res.error || "Upload failed");
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to upload photo");
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read image file");
      setUploadingPhoto(false);
    }
  };

  const add = async () => {
    if (!form.name || !form.story) { toast.error("Name and story required"); return; }
    setAdding(true);
    try {
      await api("/api/admin/data?action=add_success_story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo_url: photoUrl || null }),
      });
      toast.success("Story added!");
      setForm({ name: "", city: "", married: "", story: "" });
      setPhotoUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
    } catch {
      toast.error("Failed to add story");
    } finally {
      setAdding(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      await api("/api/admin/data?action=delete_success_story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete story");
    }
  };

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "1.25rem" }}>Success Stories ({stories.length})</h2>

      {/* Add form */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} style={{ color: "#6B1A2A" }} /> Add New Success Story
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Couple Names (e.g. Priya & Karthik)"
            style={{ padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", gridColumn: "1 / -1" }}
          />
          <input
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="City (e.g. Chennai)"
            style={{ padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none" }}
          />
          <input
            value={form.married}
            onChange={e => setForm(f => ({ ...f, married: e.target.value }))}
            placeholder="Married Date (e.g. March 2025)"
            style={{ padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none" }}
          />
        </div>

        {/* Photo Upload for Story */}
        <div style={{ marginBottom: "1rem", padding: "1rem", background: "#fafafa", borderRadius: "8px", border: "1px dashed #d0d0d0" }}>
          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#444", marginBottom: "0.5rem" }}>
            Couple Photo (Storage Bucket: success stories)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: "none" }}
              id="story-photo-input"
            />
            <label
              htmlFor="story-photo-input"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1rem",
                background: uploadingPhoto ? "#eee" : "#fff",
                border: "1.5px solid #6B1A2A",
                color: "#6B1A2A",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: uploadingPhoto ? "not-allowed" : "pointer",
              }}
            >
              <Upload size={14} /> {uploadingPhoto ? "Uploading to Bucket…" : "Select Photo"}
            </label>

            {photoUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={photoUrl}
                  alt="Story preview"
                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                />
                <button
                  type="button"
                  onClick={() => { setPhotoUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  style={{ background: "none", border: "none", color: "#c62828", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <X size={14} /> Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <textarea
          value={form.story}
          onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
          placeholder="Their love story…"
          rows={3}
          style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", marginBottom: "1rem", boxSizing: "border-box", outline: "none" }}
        />
        <button
          onClick={add}
          disabled={adding || uploadingPhoto}
          style={{
            padding: "0.625rem 1.5rem",
            background: "#6B1A2A",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: (adding || uploadingPhoto) ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Plus size={16} /> {adding ? "Adding…" : "Add Story"}
        </button>
      </div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "#888" }}>
          <Heart size={36} style={{ color: "#C8973A", margin: "0 auto 0.75rem", opacity: 0.7 }} />
          <div style={{ fontWeight: 700, color: "#333", marginBottom: "4px" }}>No success stories published yet</div>
          <div style={{ fontSize: "0.8125rem", color: "#999" }}>Stories added using the form above will appear here and on the main website.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {stories.map(s => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "#f5e6e9", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.photo_url ? (
                  <img src={s.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Heart size={24} style={{ color: "#6B1A2A", opacity: 0.6 }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1a1a1a" }}>{s.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "#C8973A", fontWeight: 600 }}>
                  {[s.city, s.married].filter(Boolean).join(" · ")}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#555", marginTop: "4px", lineHeight: 1.5 }}>{s.story}</div>
              </div>
              <button
                onClick={() => del(s.id)}
                style={{
                  padding: "4px 10px",
                  background: "#fff5f5",
                  border: "1px solid #ffcdd2",
                  borderRadius: "6px",
                  color: "#c62828",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
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
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={18} style={{ color: "#6B1A2A" }} /> Compose Notification
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          {["all", "user"].map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0.5rem 1rem", border: `1.5px solid ${target === t ? "#6B1A2A" : "#e0e0e0"}`, borderRadius: "8px", background: target === t ? "#F5E6E9" : "#fff", fontSize: "0.875rem", fontWeight: target === t ? 700 : 500 }}>
              <input type="radio" name="target" value={t} checked={target === t} onChange={() => setTarget(t)} style={{ accentColor: "#6B1A2A" }} />
              {t === "all" ? "Broadcast to ALL users" : "Send to specific user"}
            </label>
          ))}
        </div>

        {target === "user" && (
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (UUID)" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }} />
        )}

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message body…" rows={4} style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontFamily: "inherit", fontSize: "0.875rem", resize: "vertical", marginBottom: "1rem", boxSizing: "border-box", outline: "none" }} />

        <button onClick={send} disabled={sending} style={{ padding: "0.75rem 2rem", background: sending ? "#ccc" : "linear-gradient(135deg, #6B1A2A, #C8973A)", color: "#fff", border: "none", borderRadius: "8px", cursor: sending ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: "0.9375rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Send size={16} /> {sending ? "Sending…" : target === "all" ? "Send Broadcast" : "Send Notification"}
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
        <Flag size={36} style={{ color: "#888", margin: "0 auto 0.75rem", opacity: 0.6 }} />
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

  const activeSectionObj = SECTIONS.find(s => s.id === section);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Lato', -apple-system, sans-serif" }}>
      {/* Sidebar — desktop */}
      <div style={{ display: "none" }} className="admin-sidebar-desktop">
        <Sidebar active={section} onSelect={(s) => { setSection(s); setMobileSidebar(false); }} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }} onClick={() => setMobileSidebar(false)}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "230px" }} onClick={e => e.stopPropagation()}>
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
            <button onClick={() => setMobileSidebar(v => !v)} className="admin-hamburger" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
              <Menu size={20} style={{ color: "#333" }} />
            </button>
            <div style={{ fontWeight: 800, color: "#6B1A2A", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#C8973A", display: "flex", alignItems: "center" }}>{activeSectionObj?.icon}</span>
              {activeSectionObj?.label}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8125rem", color: "#888" }}>Administrator</span>
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
