"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/hooks/useMembership";
import Navbar from "@/components/layout/Navbar";
import {
  Search, Phone, Video, MoreVertical,
  Send, CheckCheck, Check, Crown, MessageCircle, Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  getConversations,
  getMessages,
  sendMessage,
  getUserById,
  type ConversationSummary,
  type MessageRow,
} from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";

// ── FORMAT HELPERS ─────────────────────────────────────────────────────
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatLastSeen(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── AVATAR ────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden",
      background: "#F5E6E9", display: "flex", alignItems: "center", justifyContent: "center",
      border: "1.5px solid #E8D5B7", flexShrink: 0,
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: size * 0.35, fontWeight: 700, color: "#6B1A2A", fontFamily: "var(--font-sans)" }}>{initials}</span>
      }
    </div>
  );
}

// ── CONVERSATION ITEM ─────────────────────────────────────────────────
function ConversationItem({
  conv, selected, onClick,
}: {
  conv: ConversationSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const profile = conv.partnerProfile;
  const name = profile?.name || "Unknown Member";
  const photo = profile?.photoUrl;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.875rem 1rem", background: selected ? "#FFF0F5" : "#fff",
        border: "none", borderLeft: selected ? "3px solid #6B1A2A" : "3px solid transparent",
        cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)",
        borderBottom: "1px solid #F2E8D6", transition: "background 0.12s",
      }}
    >
      <Avatar src={photo} name={name} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </span>
          {profile?.isPremium && (
            <Crown size={11} style={{ color: "#C8973A", flexShrink: 0 }} fill="#C8973A" />
          )}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {conv.lastMessage}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
        <span style={{ fontSize: "0.6875rem", color: "#aaa" }}>{formatLastSeen(conv.lastMessageAt)}</span>
        {conv.unreadCount > 0 && (
          <div style={{
            background: "#6B1A2A", color: "#fff", borderRadius: "50%",
            width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.6rem", fontWeight: 700,
          }}>
            {conv.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────
function MessageBubble({ msg, isMe }: { msg: MessageRow; isMe: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "0.5rem" }}>
      <div style={{ maxWidth: "65%" }}>
        <div style={{
          background: isMe ? "#6B1A2A" : "#f5f5f5",
          color: isMe ? "#fff" : "#1a1a1a",
          borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          padding: "0.625rem 0.875rem",
          fontSize: "0.875rem", lineHeight: 1.5,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}>
          {msg.content}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: "3px" }}>
          <span style={{ fontSize: "0.625rem", color: "#aaa" }}>{formatTime(msg.sentAt)}</span>
          {isMe && msg.readAt && <CheckCheck size={11} style={{ color: "#C8973A" }} />}
          {isMe && !msg.readAt && <Check size={11} style={{ color: "#aaa" }} />}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────
function MessagesContent() {
  const { user, loading: authLoading } = useAuth();
  const { can } = useMembership();
  const searchParams = useSearchParams();
  const initPartnerId = searchParams?.get("partnerId");
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initPartnerId || null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.partnerId === selectedId);
  const selectedProfile = selectedConv?.partnerProfile;

  // ── MEMBERSHIP GATE ────────────────────────────────────────
  // Wait for auth to load before gating (prevents false lock on refresh)
  if (!authLoading && !can("messages")) {
    return (
      <>
        <Navbar />
        <main style={{ background: "var(--bg-page)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #E8D5B7",
            padding: "3rem 2.5rem",
            textAlign: "center",
            maxWidth: "440px",
            boxShadow: "0 8px 32px rgba(107,26,42,0.12)",
          }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}>
              <Lock size={32} color="#fff" />
            </div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "0.5rem" }}>Messages for Gold Members</h2>
            <p style={{ color: "#666", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Upgrade to <strong>Gold</strong> or higher to chat with all matched profiles.
              Free members can only reply after a mutual connection.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/membership"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  background: "linear-gradient(135deg, #C8973A 0%, #E8C060 100%)",
                  color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                  borderRadius: "30px", padding: "0.75rem 2rem",
                  textDecoration: "none", boxShadow: "0 4px 16px rgba(200,151,58,0.35)",
                }}
              >
                <Crown size={16} />
                Upgrade to Gold — ₹999/mo
              </Link>
              <Link href="/matches" style={{ color: "#6B1A2A", fontWeight: 600, fontSize: "0.875rem" }}>
                Back to Matches
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConvs(true);
    const convs = await getConversations(user.id);
    
    // Inject the new partner if started from profile page
    if (initPartnerId && initPartnerId !== user.id) {
      const exists = convs.find(c => c.partnerId === initPartnerId);
      if (!exists) {
        const p = await getUserById(initPartnerId);
        if (p) {
          convs.unshift({
            partnerId: initPartnerId,
            partnerProfile: p,
            lastMessage: "",
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
            isInitiatedByPartner: false,
          });
        }
      }
      setSelectedId(initPartnerId);
      // Optional: Clean up the URL parameter visually so reloading doesn't get sticky
      router.replace("/messages");
    }

    setConversations(convs);
    setLoadingConvs(false);
  }, [user?.id, initPartnerId, router]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages when partner changes
  useEffect(() => {
    if (!user || !selectedId) return;
    setLoadingMsgs(true);
    getMessages(user.id, selectedId)
      .then(setMessages)
      .finally(() => setLoadingMsgs(false));
  }, [user?.id, selectedId]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const row = payload.new as Record<string, any>;
          const newMsg: MessageRow = {
            id: row.id,
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            content: row.content,
            readAt: row.read_at ?? undefined,
            sentAt: row.sent_at,
          };
          // If this message is from the selected partner, add to messages
          if (row.sender_id === selectedId) {
            setMessages((prev) => [...prev, newMsg]);
          }
          // Refresh conversations list
          loadConversations();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, selectedId, loadConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !user || !selectedId) return;

    setSending(true);
    const result = await sendMessage(user.id, selectedId, text);
    setSending(false);

    if (result.error === "upgrade") {
      toast.error("Upgrade to Premium to send messages first. If they messaged you, you can reply.", {
        duration: 5000,
        icon: undefined,
      });
      return;
    }
    if (result.error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }

    setInputText("");
    // Refresh messages
    const updated = await getMessages(user.id, selectedId);
    setMessages(updated);
    loadConversations();
  };

  const filteredConvs = conversations.filter((c) =>
    (c.partnerProfile?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <>
        <Navbar />
        <main style={{ background: "#FFF8F0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6B1A2A", fontWeight: 600 }}>Please log in to view messages.</p>
            <Link href="/login" style={{ color: "#C8973A", fontWeight: 700 }}>Login →</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFF8F0", minHeight: "100vh", padding: "1.25rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>

          {/* Search bar */}
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", background: "#fff", border: "1px solid #E8D5B7", borderRadius: "20px",
                  padding: "0.5rem 0.875rem 0.5rem 2.75rem", fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {/* ── LEFT SIDEBAR ── */}
            <aside style={{
              width: "320px", flexShrink: 0, background: "#fff",
              border: "1px solid #E8D5B7", borderRadius: "12px",
              overflow: "hidden", boxShadow: "0 1px 3px rgba(107,26,42,0.08)",
            }}>
              {/* Header */}
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid #F2E8D6", background: "#6B1A2A" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#fff" }}>Messages</span>
              </div>

              {/* Conversation list */}
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                {loadingConvs ? (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "#aaa", fontSize: "0.875rem" }}>
                    Loading conversations…
                  </div>
                ) : filteredConvs.length === 0 ? (
                  <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                    <MessageCircle size={40} style={{ color: "#E8D5B7", margin: "0 auto 0.75rem" }} />
                    <div style={{ fontWeight: 600, color: "#6B1A2A", fontSize: "0.875rem", marginBottom: "0.5rem" }}>No conversations yet</div>
                    <div style={{ fontSize: "0.75rem", color: "#aaa", lineHeight: 1.5 }}>
                      When a premium member messages you, or you start a conversation, it will appear here.
                    </div>
                    <Link href="/matches" style={{
                      display: "inline-flex", marginTop: "1rem",
                      background: "#6B1A2A", color: "#fff", borderRadius: "20px",
                      padding: "0.4rem 1.25rem", fontSize: "0.75rem",
                      fontWeight: 700, textDecoration: "none",
                    }}>
                      Browse Matches
                    </Link>
                  </div>
                ) : (
                  filteredConvs.map((conv) => (
                    <ConversationItem
                      key={conv.partnerId}
                      conv={conv}
                      selected={selectedId === conv.partnerId}
                      onClick={() => setSelectedId(conv.partnerId)}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* ── RIGHT: CHAT WINDOW ── */}
            <div style={{
              flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              background: "#fff", border: "1px solid #E8D5B7", borderRadius: "12px",
              overflow: "hidden", boxShadow: "0 1px 3px rgba(107,26,42,0.08)",
              minHeight: "calc(100vh - 160px)",
            }}>
              {!selectedId ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
                  <MessageCircle size={56} style={{ color: "#E8D5B7", marginBottom: "1rem" }} />
                  <h2 style={{ color: "#6B1A2A", fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.5rem" }}>Your Messages</h2>
                  <p style={{ color: "#888", fontSize: "0.875rem", textAlign: "center", maxWidth: "300px", lineHeight: 1.6 }}>
                    Select a conversation from the left to start chatting. Premium members can initiate conversations.
                  </p>
                  {!user.isPremium && (
                    <Link href="/membership" style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      marginTop: "1.5rem", background: "#6B1A2A", color: "#fff",
                      borderRadius: "20px", padding: "0.625rem 1.5rem",
                      fontSize: "0.875rem", fontWeight: 700, textDecoration: "none",
                    }}>
                      <Crown size={14} /> Upgrade to Message First
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div style={{
                    padding: "0.875rem 1.25rem", borderBottom: "1px solid #F2E8D6",
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    background: "#fff", flexShrink: 0,
                  }}>
                    <Avatar src={selectedProfile?.photoUrl} name={selectedProfile?.name || "Member"} size={42} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1a1a1a" }}>
                          {selectedProfile?.name || "Member"}
                        </span>
                        {selectedProfile?.isPremium && (
                          <Crown size={13} style={{ color: "#C8973A" }} fill="#C8973A" />
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 500 }}>
                        {[
                          selectedProfile?.occupation,
                          [selectedProfile?.city, selectedProfile?.state].filter(Boolean).join(", "),
                        ].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => toast("Voice calls available for premium members")}
                        style={{
                          background: "none", border: "1px solid #E8D5B7", borderRadius: "50%",
                          width: "36px", height: "36px", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", color: "#6B1A2A",
                        }}
                      >
                        <Phone size={15} />
                      </button>
                      <button
                        onClick={() => toast("Video calls available for premium members")}
                        style={{
                          background: "none", border: "1px solid #E8D5B7", borderRadius: "50%",
                          width: "36px", height: "36px", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", color: "#6B1A2A",
                        }}
                      >
                        <Video size={15} />
                      </button>
                      <Link
                        href={`/profile/${selectedId}`}
                        style={{
                          background: "none", border: "1px solid #E8D5B7", borderRadius: "50%",
                          width: "36px", height: "36px", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", color: "#6B1A2A",
                          textDecoration: "none",
                        }}
                      >
                        <MoreVertical size={15} />
                      </Link>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", background: "#FAFAF8", display: "flex", flexDirection: "column" }}>
                    {loadingMsgs ? (
                      <div style={{ textAlign: "center", color: "#aaa", fontSize: "0.875rem", padding: "2rem" }}>Loading messages…</div>
                    ) : messages.length === 0 ? (
                      <div style={{ textAlign: "center", color: "#aaa", fontSize: "0.875rem", padding: "2rem" }}>
                        No messages yet. Say hello!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <MessageBubble
                          key={msg.id}
                          msg={msg}
                          isMe={msg.senderId === user.id}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #F2E8D6", background: "#fff", flexShrink: 0 }}>
                    {!user.isPremium && !selectedConv?.isInitiatedByPartner ? (
                      <div style={{ textAlign: "center", padding: "0.5rem" }}>
                        <p style={{ fontSize: "0.8125rem", color: "#888", marginBottom: "0.75rem" }}>
                          Upgrade to Premium to send messages
                        </p>
                        <Link
                          href="/membership"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            background: "#6B1A2A", color: "#fff", borderRadius: "20px",
                            padding: "0.625rem 1.5rem", fontSize: "0.875rem",
                            fontWeight: 700, textDecoration: "none",
                          }}
                        >
                          <Crown size={14} /> Upgrade Now
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                          <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                            placeholder="Type a message…"
                            style={{
                              width: "100%", background: "#f5f5f5", border: "1.5px solid #E8D5B7",
                              borderRadius: "20px", padding: "0.625rem 1rem", fontSize: "0.875rem",
                              fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#6B1A2A")}
                            onBlur={(e) => (e.target.style.borderColor = "#E8D5B7")}
                          />
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!inputText.trim() || sending}
                          style={{
                            background: inputText.trim() && !sending ? "#6B1A2A" : "#e0e0e0",
                            border: "none", borderRadius: "50%", width: "40px", height: "40px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: inputText.trim() && !sending ? "pointer" : "default",
                            color: "#fff", flexShrink: 0, transition: "background 0.15s",
                          }}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
