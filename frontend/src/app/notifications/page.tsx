"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bell, Heart, Eye, MessageCircle, BookmarkPlus, Star, CheckCheck, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type NotifType = "interest" | "view" | "message" | "shortlist" | "match" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

const getMockNotifications = (userGender?: string): Notification[] => {
  const isFemaleViewer = userGender === "female";
  return [
  {
    id: "n1",
    type: "interest",
    title: "New Interest Received",
    body: isFemaleViewer 
      ? "Karthik Chandrasekaran sent you an interest. He's a 28-year-old Product Manager from Hyderabad."
      : "Priya Krishnamurthy sent you an interest. She's a 25-year-old Software Engineer from Chennai.",
    time: "2 min ago",
    read: false,
    href: "/matches",
  },
  {
    id: "n2",
    type: "match",
    title: "New Match Found",
    body: isFemaleViewer
      ? "We found a new 91% match for you! Arun Balakrishnan from Chennai is waiting."
      : "We found a new 91% match for you! Divya Sundaram from Coimbatore is waiting.",
    time: "15 min ago",
    read: false,
    href: "/matches",
  },
  {
    id: "n3",
    type: "view",
    title: "Profile Viewed",
    body: "Someone from Bengaluru viewed your profile.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    type: "message",
    title: "New Message",
    body: isFemaleViewer
      ? "You have a new message from Suresh Lakshmanan."
      : "You have a new message from Priya Subramaniam.",
    time: "2 hrs ago",
    read: true,
    href: "/messages",
  },
  {
    id: "n5",
    type: "shortlist",
    title: "Shortlisted by Someone",
    body: "A verified profile from Singapore shortlisted you.",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: "n6",
    type: "interest",
    title: "Interest Accepted!",
    body: isFemaleViewer
      ? "Balaji Narayanan accepted your interest. You can now send a message."
      : "Kavitha Rajan accepted your interest. You can now send a message.",
    time: "Yesterday",
    read: true,
    href: "/messages",
  },
  {
    id: "n7",
    type: "system",
    title: "Complete Your Profile",
    body: "Your profile is 70% complete. Add your horoscope details to improve match quality.",
    time: "Yesterday",
    read: true,
    href: "/profile/edit",
  },
  {
    id: "n8",
    type: "view",
    title: "Profile Viewed 3 Times Today",
    body: "Your profile was viewed 3 times today. Upgrade to Gold to see who viewed you.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n9",
    type: "match",
    title: "Weekly Match Digest",
    body: "15 new profiles matching your preferences were added this week.",
    time: "3 days ago",
    read: true,
    href: "/matches",
  },
]};

// Notification type config
const NOTIF_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  interest: {
    icon: <Heart size={16} fill="#E8401A" strokeWidth={0} />,
    color: "#E8401A",
    bg: "#FFF0EC",
  },
  view: {
    icon: <Eye size={16} />,
    color: "#1A73E8",
    bg: "#EBF5FB",
  },
  message: {
    icon: <MessageCircle size={16} />,
    color: "#7B1FA2",
    bg: "#F3E5F5",
  },
  shortlist: {
    icon: <BookmarkPlus size={16} />,
    color: "#F57C00",
    bg: "#FFF3E0",
  },
  match: {
    icon: <Star size={16} fill="#3D7A28" strokeWidth={0} />,
    color: "#3D7A28",
    bg: "#EAF5E3",
  },
  system: {
    icon: <Bell size={16} />,
    color: "#777",
    bg: "#f5f5f5",
  },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(getMockNotifications(user?.gender));
  }, [user?.gender]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast("Notification removed");
  };

  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <>
      <Navbar />
      <main style={{ background: "#f2f2f2", minHeight: "100vh" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "1.5rem 1rem 2.5rem" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h1 style={{ fontSize: "1.1875rem", fontWeight: 700, color: "#222", margin: 0 }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span style={{ fontSize: "0.8125rem", color: "#777", marginTop: "2px", display: "block" }}>
                  You have <strong style={{ color: "var(--bm-orange)" }}>{unreadCount}</strong> unread notifications
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: "var(--bm-green)",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <Link
                href="/settings"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777",
                }}
              >
                <Settings size={15} />
              </Link>
            </div>
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flex: 1,
                  padding: "0.625rem 0",
                  border: "none",
                  background: filter === f ? "var(--bm-green)" : "#fff",
                  color: filter === f ? "#fff" : "#555",
                  fontWeight: filter === f ? 700 : 400,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notification list */}
          {displayed.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <Bell size={40} style={{ color: "#ddd", margin: "0 auto 0.875rem" }} />
              <p style={{ fontWeight: 700, color: "#222", marginBottom: "0.375rem" }}>No notifications</p>
              <p style={{ fontSize: "0.8125rem", color: "#777" }}>
                {filter === "unread" ? "You've read everything!" : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {displayed.map((notif) => {
                const config = NOTIF_CONFIG[notif.type];
                return (
                  <div
                    key={notif.id}
                    style={{
                      background: notif.read ? "#fff" : "#FAFFF8",
                      border: "1px solid #e0e0e0",
                      borderLeft: !notif.read ? "3px solid var(--bm-green)" : "3px solid transparent",
                      borderRadius: "6px",
                      padding: "0.875rem 1rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.875rem",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      markRead(notif.id);
                      if (notif.href) window.location.href = notif.href;
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: config.bg,
                        color: config.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: notif.read ? 500 : 700,
                          fontSize: "0.875rem",
                          color: "#222",
                          marginBottom: "2px",
                        }}
                      >
                        {notif.title}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.5 }}>
                        {notif.body}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "4px" }}>{notif.time}</div>
                    </div>

                    {/* Unread dot */}
                    {!notif.read && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--bm-green)",
                          flexShrink: 0,
                          marginTop: "4px",
                        }}
                      />
                    )}

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif(notif.id);
                      }}
                      style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ccc",
                        opacity: 0.6,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
