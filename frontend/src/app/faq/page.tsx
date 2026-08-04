"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Registration",
    questions: [
      {
        q: "How do I create a profile?",
        a: "Click 'Register Free' and follow our 8-step guided wizard. It takes about 5 minutes and covers basic info, education, religion, location, lifestyle, and partner preferences. You can update any section later.",
      },
      {
        q: "Is registration free?",
        a: "Yes! Creating a profile is 100% free. You can browse profiles and receive interests at no cost. Premium features like contact reveals and AI match scores require a Gold or Diamond subscription.",
      },
      {
        q: "Can I create a profile on behalf of my son/daughter?",
        a: "Absolutely. In the first step of registration, select 'My Son', 'My Daughter', 'My Brother', or 'My Sister'. The profile will be clearly marked as created by a guardian.",
      },
      {
        q: "Can I have multiple profiles?",
        a: "No. One phone number can be associated with one profile only. This prevents spam and ensures every user is genuine.",
      },
    ],
  },
  {
    category: "Privacy & Safety",
    questions: [
      {
        q: "Is my phone number visible to everyone?",
        a: "No. Your phone number is hidden by default. It is only shared when you explicitly choose to reveal it or accept a contact request from a premium member you've matched with.",
      },
      {
        q: "Who can see my photos?",
        a: "By default, your photos are visible to all logged-in members. You can change photo privacy settings in your account settings to show photos only to members you've expressed interest in.",
      },
      {
        q: "How do I block someone?",
        a: "On any profile page, tap the three-dot menu (⋮) and select 'Block'. Blocked users cannot view your profile, send you messages, or see you in search results.",
      },
      {
        q: "Is my data safe?",
        a: "We follow industry-standard encryption and data protection practices. All data is stored securely and we never sell your personal information to third parties.",
      },
    ],
  },
  {
    category: "Membership & Billing",
    questions: [
      {
        q: "What are the membership plans?",
        a: "We offer Free, Gold (₹999/month), Diamond (₹1,999/month), and Platinum Concierge (₹9,999 for 3 months). Each plan has different contact reveal limits and features.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel any paid subscription from your account settings. You'll continue to have premium access until the end of your current billing period. No refund for the remaining days except in the first 7 days of your first purchase.",
      },
      {
        q: "How does billing work?",
        a: "Your subscription auto-renews on the same date each month (or at the end of your plan period for Platinum). You'll receive an email reminder 3 days before renewal.",
      },
      {
        q: "Do you offer a refund?",
        a: "We offer a 7-day money-back guarantee for your first purchase. Contact support@elitetamilmatrimony.com within 7 days of purchase with your registered email and reason.",
      },
    ],
  },
  {
    category: "AI & Matching",
    questions: [
      {
        q: "How does the compatibility score work?",
        a: "Our AI analyzes 5 dimensions: education compatibility, religion/cultural alignment, career/lifestyle match, location preference, and values alignment. Each dimension gets a score and the overall percentage is a weighted average.",
      },
      {
        q: "Why are some profiles marked as 'top match'?",
        a: "Profiles with a compatibility score above 85% are highlighted as top matches. These are profiles where multiple dimensions align particularly well with your profile data.",
      },
      {
        q: "Can I change my preferences to get better matches?",
        a: "Yes. Go to Settings → Partner Preferences to update your age range, religion, location, education, and lifestyle preferences. Matches are re-computed within 24 hours.",
      },
    ],
  },
  {
    category: "Verification",
    questions: [
      {
        q: "How do I get verified?",
        a: "Go to your profile → Verification Center. You can verify via: (1) Phone OTP (done at registration), (2) Email click, (3) ID upload (Aadhaar/PAN/Passport — reviewed by our team within 48 hours), (4) Selfie photo match.",
      },
      {
        q: "Is Aadhaar verification mandatory?",
        a: "No, Aadhaar verification is optional. However, verified profiles get higher search ranking and a 'Verified' badge that increases trust and response rates by up to 3x.",
      },
      {
        q: "How long does verification take?",
        a: "Phone and email verification is instant. ID verification (Aadhaar/PAN/Passport) takes 24–48 hours as our team manually reviews documents. Photo verification is typically instant.",
      },
    ],
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = FAQ_DATA.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream-bg)", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          className="section"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="container text-center text-white">
            <h1 className="text-heading-xl text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 mb-8 max-w-lg mx-auto text-sm">
              Everything you need to know about Elite Tamil Matrimony.
            </p>
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                className="form-input pl-10 text-[var(--text-primary)]"
                placeholder="Search FAQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "white" }}
              />
            </div>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="section">
          <div className="container max-w-3xl">
            {filtered.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-[var(--text-secondary)]">No results found for &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filtered.map((cat) => (
                  <div key={cat.category}>
                    <h2
                      className="font-bold text-[var(--text-primary)] mb-4 pb-3 border-b"
                      style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", borderColor: "var(--border)" }}
                    >
                      {cat.category}
                    </h2>
                    <div className="space-y-3">
                      {cat.questions.map((item, i) => {
                        const key = `${cat.category}-${i}`;
                        const isOpen = openItems.has(key);
                        return (
                          <div key={key} className="card overflow-hidden">
                            <button
                              onClick={() => toggle(key)}
                              className="w-full text-left p-5 flex items-start justify-between gap-4"
                            >
                              <span className="font-semibold text-[var(--text-primary)] text-sm leading-relaxed">
                                {item.q}
                              </span>
                              <span
                                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                                style={{ background: isOpen ? "var(--rose-50)" : "var(--cream-bg)", color: isOpen ? "var(--rose-primary)" : "var(--text-muted)" }}
                              >
                                {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                              </span>
                            </button>
                            {isOpen && (
                              <div
                                className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed"
                                style={{ borderTop: "1px solid var(--border-light)" }}
                              >
                                <div className="pt-4">{item.a}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <div
              className="mt-10 p-6 rounded-2xl text-center"
              style={{ background: "var(--rose-50)", border: "1px solid var(--rose-200)" }}
            >
              <p className="font-semibold text-[var(--text-primary)] mb-2">
                Still have questions?
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Our support team is available Monday–Saturday, 9am–6pm IST.
              </p>
              <a
                href="/contact"
                className="btn btn-primary"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
