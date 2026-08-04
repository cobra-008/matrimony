"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import {
  Search, SlidersHorizontal, Phone, Video, MoreVertical,
  Smile, Paperclip, Send, CheckCheck, Check, Circle,
  Star, Crown, ShieldCheck, Gift, X, ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { MOCK_PROFILES, MOCK_GROOM_PROFILES } from "@/data/mock-profiles";

// ── TYPES ─────────────────────────────────────────────────────────────
type MessageTab = "received" | "awaiting" | "calls";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  isVerified: boolean;
  isPremium: boolean;
  lastMessage: string;
  time: string;
  unread: number;
  isAssisted?: boolean;
}

interface Message {
  id: string;
  from?: "me" | "them";
  text?: string;
  type?: "text" | "date" | "system" | "request" | "interest";
  time?: string;
  date?: string;
  status?: "sent" | "delivered" | "read";
}

// ── MOCK DATA ─────────────────────────────────────────────────────────
const getMockConversations = (userGender?: string): Conversation[] => {
  const isFemale = userGender === "female";
  const profiles = isFemale ? MOCK_GROOM_PROFILES : MOCK_PROFILES;
  
  return [
  {
    id: "assisted",
    name: "Assisted Service",
    isOnline: true,
    isVerified: true,
    isPremium: false,
    lastMessage: "Find your match 3x faster!",
    time: "Today",
    unread: 1,
    isAssisted: true,
  },
  {
    id: profiles[0]?.id || "m1",
    name: profiles[0]?.name || "Match 1",
    avatar: profiles[0]?.photoUrl,
    isOnline: true,
    isVerified: profiles[0]?.isVerified ?? true,
    isPremium: profiles[0]?.isPremium ?? false,
    lastMessage: "Hi, I came across your profile and thought we might be compatible.",
    time: "2h ago",
    unread: 2,
  },
  {
    id: profiles[1]?.id || "m2",
    name: profiles[1]?.name || "Match 2",
    avatar: profiles[1]?.photoUrl,
    isOnline: false,
    isVerified: profiles[1]?.isVerified ?? true,
    isPremium: profiles[1]?.isPremium ?? false,
    lastMessage: "Thank you for your interest! I'd love to know more about you.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: profiles[2]?.id || "m3",
    name: profiles[2]?.name || "Match 3",
    avatar: profiles[2]?.photoUrl,
    isOnline: true,
    isVerified: profiles[2]?.isVerified ?? false,
    isPremium: profiles[2]?.isPremium ?? false,
    lastMessage: "Looks like we share a lot of common values 😊",
    time: "Wed",
    unread: 0,
  },
  {
    id: profiles[3]?.id || "m4",
    name: profiles[3]?.name || "Match 4",
    avatar: profiles[3]?.photoUrl,
    isOnline: false,
    isVerified: profiles[3]?.isVerified ?? true,
    isPremium: profiles[3]?.isPremium ?? true,
    lastMessage: "Would love to connect on a video call after family approval.",
    time: "Mon",
    unread: 0,
  },
]};

const MOCK_MESSAGES: Record<string, Message[]> = {
  assisted: [
    { id: "1", type: "date", date: "18 Jul 2026" },
    {
      id: "2", from: "them", type: "system",
      text: "👋 Welcome to Assisted Service. Our Relationship Manager will help you find your perfect match.",
      time: "10:00 AM",
    },
    {
      id: "3", from: "them", type: "request",
      text: "Your profile is 60% complete. Add a photo to get 8x more responses!",
      time: "10:01 AM",
    },
  ],
  [MOCK_PROFILES[0].id]: [
    { id: "1", type: "date", date: "22 Jul 2026" },
    { id: "2", from: "them", text: "Hi! I came across your profile and thought we might be compatible 😊", time: "3:45 PM", status: "read" },
    { id: "3", from: "me", text: "Hello! Thank you so much. I really liked your profile too.", time: "4:10 PM", status: "read" },
    { id: "4", from: "them", text: "I noticed we're both from Chennai and have similar interests. What do you do for fun?", time: "4:15 PM", status: "read" },
    { id: "5", from: "me", text: "I love reading and Carnatic music! I also enjoy cooking traditional Tamil dishes 🍛", time: "4:32 PM", status: "delivered" },
    { id: "6", type: "date", date: "Today" },
    { id: "7", from: "them", text: "That's wonderful! I'm passionate about music too. Would you be open to a video call so we can get to know each other better?", time: "9:15 AM", status: "read" },
    { id: "8", from: "them", text: "My family is also very supportive and would love to speak with yours soon 😊", time: "9:16 AM", status: "read" },
  ],
  [MOCK_PROFILES[1].id]: [
    { id: "1", type: "date", date: "20 Jul 2026" },
    { id: "2", from: "them", text: "Thank you for showing interest in my profile!", time: "11:00 AM", status: "read" },
    { id: "3", from: "me", text: "Of course! I think we have a lot in common. Would love to connect.", time: "11:30 AM", status: "read" },
    { id: "4", from: "them", text: "Great! I'd love to know more about you. Tell me about your family.", time: "2:00 PM", status: "read" },
  ],
  [MOCK_GROOM_PROFILES[0].id]: [
    { id: "1", type: "date", date: "18 Jul 2026" },
    { id: "2", from: "them", text: "Hi! Looks like we share a lot of common values 😊", time: "5:00 PM", status: "read" },
    { id: "3", from: "me", text: "Yes, I noticed that too! Looking forward to getting to know you better.", time: "5:45 PM", status: "read" },
  ],
  [MOCK_GROOM_PROFILES[1].id]: [
    { id: "1", type: "date", date: "14 Jul 2026" },
    { id: "2", from: "them", text: "Would love to connect on a video call after family approval.", time: "6:30 PM", status: "read" },
    { id: "3", from: "me", text: "Absolutely! Let's plan that soon.", time: "7:00 PM", status: "read" },
  ],
};

// ── AVATAR ────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40, online }: { src?: string; name: string; size?: number; online?: boolean }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "var(--primary-light)",
        display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--border-light)",
      }}>
        {src
          ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: size * 0.35, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-sans)" }}>{initials}</span>
        }
      </div>
      {online && (
        <div style={{
          position: "absolute", bottom: 1, right: 1, width: size * 0.28, height: size * 0.28,
          borderRadius: "50%", background: "#22C55E", border: "2px solid #fff",
        }} />
      )}
    </div>
  );
}

// ── CONVERSATION ITEM ─────────────────────────────────────────────────
function ConversationItem({ conv, selected, onClick }: { conv: Conversation; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        background: selected ? "#FFF0F5" : "#fff",
        border: "none",
        borderLeft: selected ? "3px solid var(--primary)" : "3px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        borderBottom: "1px solid var(--border-light)",
        transition: "background 0.12s",
      }}
    >
      {/* Avatar */}
      <Avatar
        src={conv.isAssisted ? undefined : conv.avatar}
        name={conv.isAssisted ? "AS" : conv.name}
        size={44}
        online={conv.isOnline}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {conv.name}
          </span>
          {conv.isVerified && <ShieldCheck size={12} style={{ color: "#1A73E8", flexShrink: 0 }} fill="#1A73E8" />}
          {conv.isPremium && <Crown size={11} style={{ color: "#F59E0B", flexShrink: 0 }} fill="#F59E0B" />}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {conv.lastMessage}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
        <span style={{ fontSize: "0.6875rem", color: "#aaa" }}>{conv.time}</span>
        {conv.unread > 0 && (
          <div style={{
            background: "var(--primary)", color: "#fff", borderRadius: "50%",
            width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.6rem", fontWeight: 700,
          }}>
            {conv.unread}
          </div>
        )}
      </div>
    </button>
  );
}

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────
function MessageBubble({ msg, conv }: { msg: Message; conv: Conversation }) {
  if (msg.type === "date") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
        <span style={{ fontSize: "0.6875rem", color: "#aaa", whiteSpace: "nowrap", fontWeight: 600 }}>{msg.date}</span>
        <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
      </div>
    );
  }

  if (msg.type === "system") {
    return (
      <div style={{
        background: "#f0f7ff", border: "1px solid #d0e8ff", borderRadius: "12px",
        padding: "0.875rem 1.125rem", marginBottom: "0.75rem", maxWidth: "480px",
        fontSize: "0.8125rem", color: "#333", lineHeight: 1.5,
      }}>
        {msg.text}
        {msg.time && <div style={{ fontSize: "0.625rem", color: "#aaa", marginTop: "6px" }}>{msg.time}</div>}
      </div>
    );
  }

  if (msg.type === "request") {
    return (
      <div style={{
        background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "12px",
        padding: "0.875rem 1.125rem", marginBottom: "0.75rem", maxWidth: "480px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
      }}>
        <div style={{ fontSize: "0.8125rem", color: "#555" }}>{msg.text}</div>
        <Link href="/settings" style={{ background: "var(--primary)", color: "#fff", borderRadius: "var(--radius-full)", padding: "0.375rem 1rem", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" }}>
          Add Photo
        </Link>
      </div>
    );
  }

  // Normal message
  const isMe = msg.from === "me";

  return (
    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "0.5rem", gap: "0.625rem" }}>
      {!isMe && <Avatar src={conv.avatar} name={conv.name} size={32} />}
      <div style={{ maxWidth: "65%" }}>
        <div style={{
          background: isMe ? "var(--primary)" : "#f5f5f5",
          color: isMe ? "#fff" : "#1a1a1a",
          borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          padding: "0.625rem 0.875rem",
          fontSize: "0.875rem",
          lineHeight: 1.5,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}>
          {msg.text}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: "3px" }}>
          <span style={{ fontSize: "0.625rem", color: "#aaa" }}>{msg.time}</span>
          {isMe && msg.status === "read" && <CheckCheck size={11} style={{ color: "#1A73E8" }} />}
          {isMe && msg.status === "delivered" && <CheckCheck size={11} style={{ color: "#aaa" }} />}
          {isMe && msg.status === "sent" && <Check size={11} style={{ color: "#aaa" }} />}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<MessageTab>("received");
  const [selectedId, setSelectedId] = useState("assisted");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convos = getMockConversations(user?.gender);
    setConversations(convos);
    
    if (!convos.find(c => c.id === selectedId)) {
      setSelectedId("assisted");
    }
  }, [user?.gender]);

  const selected = conversations.find(c => c.id === selectedId)!;
  const currentMessages = messages[selectedId] || [];

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const awaitingConvs = conversations.filter(c => c.unread === 0 && !c.isAssisted);
  const receivedConvs = filteredConvs;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, selectedId]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInputText("");

    // Simulate typing + reply
    if (selectedId !== "assisted") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          from: "them",
          text: "Thank you for your message! I'll get back to you soon 😊",
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          status: "delivered",
        };
        setMessages(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), reply],
        }));
      }, 1500);
    }
  };

  const TABS: { id: MessageTab; label: string; count?: number }[] = [
    { id: "received", label: "Received", count: receivedConvs.reduce((s, c) => s + c.unread, 0) },
    { id: "awaiting", label: "Awaiting", count: awaitingConvs.length },
    { id: "calls", label: "Calls" },
  ];

  return (
    <>
      <Navbar />
      <main style={{ background: "#f2f4f7", minHeight: "100vh", padding: "1.25rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>

          {/* Search bar */}
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-full)",
                  padding: "0.5rem 0.875rem 0.5rem 2.75rem", fontSize: "0.875rem", color: "var(--text-dark)",
                  fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={() => toast("Filters coming soon")}
              style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-full)", padding: "0.5rem 1rem", fontSize: "0.8125rem", color: "#555", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}
            >
              <SlidersHorizontal size={13} /> Filter
            </button>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {/* ── LEFT SIDEBAR ── */}
            <aside style={{
              width: "340px", flexShrink: 0, background: "#fff",
              border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)",
              overflow: "hidden", boxShadow: "var(--shadow-sm)",
            }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", background: "#fff" }}>
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      flex: 1, padding: "0.75rem 0.25rem",
                      border: "none", background: "transparent", cursor: "pointer",
                      fontFamily: "var(--font-sans)", fontSize: "0.8125rem",
                      fontWeight: activeTab === t.id ? 700 : 500,
                      color: activeTab === t.id ? "var(--primary)" : "#666",
                      borderBottom: activeTab === t.id ? "2.5px solid var(--primary)" : "2.5px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                    }}
                  >
                    {t.label}
                    {t.count && t.count > 0 ? (
                      <span style={{ background: "var(--primary)", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                        {t.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* Incoming label */}
              <div style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", background: "#fafafa" }}>
                <span style={{ fontSize: "0.75rem", color: "#888" }}>Incoming messages</span>
                <SlidersHorizontal size={12} style={{ color: "#aaa" }} />
              </div>

              {/* Conversation list */}
              <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
                {activeTab === "received" && (
                  receivedConvs.length > 0
                    ? receivedConvs.map(conv => (
                      <ConversationItem
                        key={conv.id}
                        conv={conv}
                        selected={selectedId === conv.id}
                        onClick={() => setSelectedId(conv.id)}
                      />
                    ))
                    : <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#aaa", fontSize: "0.8125rem" }}>No messages found</div>
                )}

                {activeTab === "awaiting" && (
                  awaitingConvs.length > 0
                    ? awaitingConvs.map(conv => (
                      <ConversationItem key={conv.id} conv={conv} selected={selectedId === conv.id} onClick={() => setSelectedId(conv.id)} />
                    ))
                    : (
                      <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                        <Circle size={40} style={{ color: "#e0e0e0", margin: "0 auto 0.75rem" }} />
                        <div style={{ fontWeight: 600, color: "#bbb", fontSize: "0.875rem" }}>No awaiting messages</div>
                      </div>
                    )
                )}

                {activeTab === "calls" && (
                  <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                    <Phone size={40} style={{ color: "#e0e0e0", margin: "0 auto 0.75rem" }} />
                    <div style={{ fontWeight: 600, color: "#bbb", fontSize: "0.875rem" }}>No call history yet</div>
                    <div style={{ fontSize: "0.75rem", color: "#ccc", marginTop: "0.375rem" }}>Upgrade to Gold to enable video calls</div>
                    <Link href="/membership" style={{ display: "inline-flex", marginTop: "1rem", background: "var(--primary)", color: "#fff", borderRadius: "var(--radius-full)", padding: "0.4rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none" }}>
                      Upgrade Now
                    </Link>
                  </div>
                )}
              </div>
            </aside>

            {/* ── RIGHT: CHAT WINDOW ── */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)", minHeight: "calc(100vh - 140px)" }}>

              {/* Chat Header */}
              <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "0.875rem", background: "#fff", flexShrink: 0 }}>
                <Avatar src={selected?.isAssisted ? undefined : selected?.avatar} name={selected?.name || "AS"} size={42} online={selected?.isOnline} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1a1a1a" }}>{selected?.name}</span>
                    {selected?.isVerified && <ShieldCheck size={14} style={{ color: "#1A73E8" }} fill="#1A73E8" />}
                    {selected?.isPremium && <Crown size={13} style={{ color: "#F59E0B" }} fill="#F59E0B" />}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: selected?.isOnline ? "#22C55E" : "#aaa", fontWeight: 500 }}>
                    {selected?.isOnline ? "● Online now" : "● Offline"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!selected?.isAssisted && (
                    <>
                      <button onClick={() => toast("Upgrade to Gold for voice calls")} style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666" }}>
                        <Phone size={15} />
                      </button>
                      <button onClick={() => toast("Upgrade to Diamond for video calls")} style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666" }}>
                        <Video size={15} />
                      </button>
                    </>
                  )}
                  <button onClick={() => toast("More options")} style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666" }}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", background: "#fafbfc", display: "flex", flexDirection: "column" }}>
                {currentMessages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} conv={selected} />
                ))}
                {isTyping && (
                  <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", marginTop: "0.5rem" }}>
                    <Avatar src={selected.avatar} name={selected.name} size={28} />
                    <div style={{ background: "#f0f0f0", borderRadius: "20px", padding: "0.5rem 0.875rem" }}>
                      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                        {[0, 0.18, 0.36].map((delay, i) => (
                          <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#aaa", animation: "bounce 0.8s infinite", animationDelay: `${delay}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-light)", background: "#fff", flexShrink: 0 }}>
                {selected?.isAssisted ? (
                  <div style={{ textAlign: "center", padding: "0.5rem" }}>
                    <Link href="/membership" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--gradient-hero)", color: "#fff", borderRadius: "var(--radius-full)", padding: "0.625rem 1.5rem", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none" }}>
                      <Crown size={14} /> Upgrade to Send Messages
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <button onClick={() => toast("Emoji picker")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "0.375rem", display: "flex", alignItems: "center" }}>
                      <Smile size={20} />
                    </button>
                    <button onClick={() => toast("Attach file")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "0.375rem", display: "flex", alignItems: "center" }}>
                      <Paperclip size={18} />
                    </button>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Type a message…"
                        style={{
                          width: "100%", background: "#f5f5f5", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-full)",
                          padding: "0.625rem 1rem", fontSize: "0.875rem", color: "var(--text-dark)", fontFamily: "var(--font-sans)",
                          outline: "none", boxSizing: "border-box",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-light)"}
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      style={{
                        background: inputText.trim() ? "var(--primary)" : "#e0e0e0",
                        border: "none", borderRadius: "50%", width: "40px", height: "40px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: inputText.trim() ? "pointer" : "default",
                        color: "#fff", flexShrink: 0, transition: "background 0.15s",
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @media (max-width: 768px) {
          aside { display: none; }
        }
      `}</style>
    </>
  );
}
