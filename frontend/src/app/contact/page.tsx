"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BackButton from "@/components/ui/BackButton";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.mobile || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream-bg)", minHeight: "100vh" }}>
        {/* Hero */}
        <section className="section" style={{ background: "var(--gradient-hero)" }}>
          <div className="container text-center text-white">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <BackButton style={{ color: "#fff", background: "rgba(255,255,255,0.1)" }} />
              <h1 className="text-heading-xl text-white" style={{ fontFamily: "var(--font-serif)", margin: 0 }}>
                Contact Us
              </h1>
            </div>
            <p className="text-white/70 max-w-md mx-auto text-sm">
              Our team is here to help. Reach out with questions, feedback, or support requests.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
              {/* Contact info */}
              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  {
                    icon: <Mail size={20} />,
                    label: "Email Support",
                    value: "support@elitetamilmatrimony.com",
                    sub: "We reply within 24 hours",
                    color: "var(--rose-primary)",
                    bg: "var(--rose-50)",
                  },
                  {
                    icon: <Phone size={20} />,
                    label: "Phone Support",
                    value: "+91 93606 53547",
                    sub: "Mon–Sat, 9am–6pm IST",
                    color: "hsl(142, 71%, 45%)",
                    bg: "hsl(142, 71%, 95%)",
                  },
                  {
                    icon: <MessageCircle size={20} />,
                    label: "Live Chat",
                    value: "Chat on the app",
                    sub: "Available in the mobile app",
                    color: "hsl(217, 91%, 55%)",
                    bg: "hsl(217, 91%, 95%)",
                  },
                  {
                    icon: <MapPin size={20} />,
                    label: "Office",
                    value: "2nd Floor, Sona College of Technology",
                    sub: "Sona Valliappa Block, Sona Incubation Foundation, Junction Main Rd, Salem, Tamil Nadu 636005",
                    color: "var(--saffron)",
                    bg: "hsl(28, 88%, 95%)",
                  },
                  {
                    icon: <Clock size={20} />,
                    label: "Support Hours",
                    value: "Mon–Sat",
                    sub: "9:00 AM – 6:00 PM IST",
                    color: "var(--gold-dark)",
                    bg: "var(--gold-50)",
                  },
                ].map((item) => (
                  <div key={item.label} className="card p-4" style={{ display: "flex", alignItems: "flex-start", gap: "1rem", background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
                    <div
                      style={{
                        width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: item.bg, color: item.color
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem", marginTop: "2px" }}>{item.value}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div style={{ flex: "2 1 500px" }}>
                <div className="card p-6 sm:p-8" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: "2rem" }}>
                  {submitted ? (
                    <div className="text-center py-10">
                      <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
                      <h3 className="font-bold text-[var(--text-primary)] text-xl mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                        Message Sent!
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">
                        Thank you for reaching out. Our team will reply within 24 hours at <strong>{form.email}</strong>.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                        className="btn btn-outline"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2
                        className="font-bold text-[var(--text-primary)] mb-6"
                        style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "1.5rem" }}
                      >
                        Send us a message
                      </h2>
                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                          <div style={{ flex: "1 1 200px" }}>
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Your name"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}
                            />
                          </div>
                          <div style={{ flex: "1 1 200px" }}>
                            <label className="form-label">Email *</label>
                            <input
                              type="email"
                              className="form-input"
                              placeholder="your@email.com"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}
                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                          <div style={{ flex: "1 1 200px" }}>
                            <label className="form-label">Phone (optional)</label>
                            <input
                              type="tel"
                              className="form-input"
                              placeholder="+91 XXXXX XXXXX"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}
                            />
                          </div>
                          <div style={{ flex: "1 1 200px" }}>
                            <label className="form-label">Subject</label>
                            <select
                              className="form-select"
                              value={form.subject}
                              onChange={(e) => setForm({ ...form, subject: e.target.value })}
                              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}
                            >
                              <option value="">Select a topic</option>
                              <option value="account">Account Issues</option>
                              <option value="billing">Billing & Subscription</option>
                              <option value="profile">Profile Help</option>
                              <option value="safety">Safety & Report</option>
                              <option value="verification">Verification</option>
                              <option value="feedback">Feedback</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Message *</label>
                          <textarea
                            className="form-input resize-none"
                            rows={5}
                            placeholder="Describe your query or feedback in detail..."
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", minHeight: "120px" }}
                          />
                          <div className="text-xs text-[var(--text-muted)] text-right mt-1">
                            {form.message.length}/1000
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary w-full justify-center"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send size={16} />
                              Send Message
                            </span>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
