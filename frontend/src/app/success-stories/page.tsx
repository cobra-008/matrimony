"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Star, Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface SuccessStory {
  id: string;
  name: string;
  city?: string;
  married?: string;
  story: string;
  photo_url?: string;
  is_visible?: boolean;
  created_at?: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const { data, error } = await supabase
          .from("success_stories")
          .select("*")
          .eq("is_visible", true)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setStories(data);
        } else {
          setStories([]);
        }
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream-bg)", minHeight: "100vh", paddingTop: "72px" }}>
        {/* Hero */}
        <section
          className="section relative overflow-hidden"
          style={{ background: "var(--gradient-hero)", padding: "3.5rem 0" }}
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
              <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Success Stories
              </span>
            </div>
            <h1
              className="text-white mb-4"
              style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 900 }}
            >
              Real Couples. Real Happiness.
            </h1>
            <p className="text-white/80 max-w-xl mx-auto text-base">
              Inspiring love stories from members who found their soulmate on Elite Tamil Matrimony.
            </p>
          </div>
        </section>

        {/* Stories list or Empty State */}
        <section className="section" style={{ padding: "3rem 0" }}>
          <div className="container">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-xl)",
                      height: "280px",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-xl)",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  maxWidth: "540px",
                  margin: "0 auto",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    color: "var(--primary)",
                  }}
                >
                  <Sparkles size={30} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
                  No Success Stories Yet
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
                  Real success stories curated by our team will be featured here. Register today and let your story be next!
                </p>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "0.75rem 1.75rem" }}
                >
                  Register Free <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="card relative overflow-hidden group"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* Story Photo if uploaded */}
                    {story.photo_url ? (
                      <div style={{ height: "200px", width: "100%", overflow: "hidden", background: "#f0f0f0" }}>
                        <img
                          src={story.photo_url}
                          alt={story.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "120px",
                          background: "var(--gradient-hero)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                        }}
                      >
                        <Heart size={36} className="fill-white text-white opacity-80" />
                      </div>
                    )}

                    <div style={{ padding: "1.25rem" }}>
                      {/* Name + meta */}
                      <div style={{ marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <h3 style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--text-dark)", margin: 0 }}>
                            {story.name}
                          </h3>
                          <CheckCircle2 size={16} style={{ color: "var(--secondary)" }} />
                        </div>
                        {(story.city || story.married) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              marginTop: "4px",
                            }}
                          >
                            {story.city && (
                              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <MapPin size={12} />
                                {story.city}
                              </span>
                            )}
                            {story.city && story.married && <span>•</span>}
                            {story.married && (
                              <span>Married: {story.married}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Story */}
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-medium)",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                          marginBottom: "1rem",
                        }}
                      >
                        &ldquo;{story.story}&rdquo;
                      </p>

                      {/* Rating stars */}
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section
          className="section"
          style={{ background: "var(--gradient-hero)", color: "white", padding: "3rem 0" }}
        >
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-sans)" }}>
              Write Your Own Love Story
            </h2>
            <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
              Find someone who shares your values, culture, and life goals.
            </p>
            <Link
              href="/register"
              className="btn btn-xl"
              style={{ background: "white", color: "var(--primary)", fontWeight: 700 }}
            >
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
