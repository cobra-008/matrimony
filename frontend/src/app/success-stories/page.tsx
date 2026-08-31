"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUCCESS_STORIES } from "@/data/matrimony-data";
import { CheckCircle2, Star, Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessStoriesPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Chennai", "NRI", "Coimbatore", "Abroad"];

  // Extended stories
  const stories = [
    ...SUCCESS_STORIES,
    {
      id: "ss4",
      name: "Ashwin & Priyanka",
      city: "Bengaluru",
      married: "March 2024",
      story:
        "We both work in tech and had our first conversation about a startup idea. Three months later we were planning our wedding. Elite Tamil Matrimony matched us on career goals — it was perfect.",
    },
    {
      id: "ss5",
      name: "Karthik & Meena",
      city: "London & Chennai",
      married: "December 2023",
      story:
        "Long-distance felt impossible, but after our very first video call I knew she was the one. We got married 4 months after matching. Distance was never an obstacle.",
    },
    {
      id: "ss6",
      name: "Sundar & Lakshmi",
      city: "Coimbatore",
      married: "February 2024",
      story:
        "Both from Gounder families, both teachers. The compatibility score said 91% and it was right in every way. We share everything — values, food preferences, even our love for Kollywood!",
    },
    {
      id: "ss7",
      name: "Dinesh & Kavya",
      city: "Singapore",
      married: "April 2024",
      story:
        "Two NRI Tamils finding each other across the world thanks to Elite Tamil Matrimony. The cultural connection was instant and the AI recommendation was spot on.",
    },
    {
      id: "ss8",
      name: "Vijay & Shantha",
      city: "Madurai",
      married: "January 2024",
      story:
        "Our horoscopes matched, our communities aligned, and our personalities clicked. My parents were overjoyed. Thank you ETM for making this journey smooth and stress-free.",
    },
    {
      id: "ss9",
      name: "Rajan & Deepa",
      city: "Toronto, Canada",
      married: "May 2024",
      story:
        "We're both Tamil diaspora in Canada and finding a Tamil partner seemed impossible until ETM. Matched within a week, engaged in 2 months. Forever grateful!",
    },
  ];

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream-bg)", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          className="section relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="container relative z-10 text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart size={18} className="fill-white text-white" />
              <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Success Stories
              </span>
            </div>
            <h1
              className="text-heading-xl text-white mb-4"
              style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem" }}
            >
              Real couples. Real happiness.
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-base">
              Over <strong className="text-white">3.2 Lakh</strong> Tamil couples have found their forever through Elite Tamil Matrimony.
            </p>
            {/* Stats bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {[
                { value: "3.2L+", label: "Marriages" },
                { value: "25L+", label: "Active Profiles" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "4.8★", label: "App Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter */}
        <div
          className="sticky top-16 z-40 py-3 border-b"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="container">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 transition-all"
                  style={{
                    background: filter === cat ? "var(--gradient-hero)" : "var(--cream-bg)",
                    color: filter === cat ? "white" : "var(--text-secondary)",
                    border: filter === cat ? "none" : "1px solid var(--border)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stories grid */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="card p-6 relative overflow-hidden group"
                  style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-xl)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  {/* Decorative quote */}
                  <div
                    className="absolute top-4 right-5 text-7xl font-serif leading-none select-none pointer-events-none"
                    style={{ color: "var(--rose-50)", fontFamily: "var(--font-serif)" }}
                  >
                    &ldquo;
                  </div>

                  {/* Couple avatar */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <Heart size={28} className="fill-white text-white" />
                  </div>

                  {/* Name + meta */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[var(--text-primary)]">{story.name}</h3>
                      <CheckCircle2 size={14} className="text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {story.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        {story.married}
                      </span>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic mb-4">
                    &ldquo;{story.story}&rdquo;
                  </p>

                  {/* Stars */}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={`star-${n}`} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="section"
          style={{ background: "var(--gradient-hero)", color: "white" }}
        >
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Write your own love story
            </h2>
            <p className="text-white/70 mb-6 text-sm">
              Join 25 Lakh+ Tamil singles and find your perfect match today.
            </p>
            <Link href="/register" className="btn btn-xl" style={{ background: "white", color: "var(--rose-primary)", fontWeight: 700 }}>
              <Heart size={18} className="fill-current" />
              Register Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
