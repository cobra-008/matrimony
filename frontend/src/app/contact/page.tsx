"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
            <h1 className="text-heading-xl text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Contact Us
            </h1>
            <p className="text-white/70 max-w-md mx-auto text-sm">
              Our team is here to help. Reach out with questions, feedback, or support requests.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact info */}
              <div className="space-y-5">
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
                  <div key={item.label} className="card p-4 flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: item.bg, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                        {item.label}
                      </div>
                      <div className="font-semibold text-[var(--text-primary)] text-sm mt-0.5">{item.value}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div className="lg:col-span-2">
                <div className="card p-6 sm:p-8">
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
                        style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}
                      >
                        Send us a message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Your name"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="form-label">Email *</label>
                            <input
                              type="email"
                              className="form-input"
                              placeholder="your@email.com"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Phone (optional)</label>
                            <input
                              type="tel"
                              className="form-input"
                              placeholder="+91 XXXXX XXXXX"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="form-label">Subject</label>
                            <select
                              className="form-select"
                              value={form.subject}
                              onChange={(e) => setForm({ ...form, subject: e.target.value })}
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
