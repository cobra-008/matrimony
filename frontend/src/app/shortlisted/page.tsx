"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { MOCK_PROFILES } from "@/data/mock-profiles";
import { BookmarkPlus, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ShortlistedPage() {
  // Mock: first 3 profiles are shortlisted
  const [shortlisted, setShortlisted] = useState(MOCK_PROFILES.slice(0, 3));

  const remove = (id: string) => {
    setShortlisted((v) => v.filter((p) => p.id !== id));
    toast.success("Removed from shortlist");
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream-bg)", minHeight: "100vh" }}>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookmarkPlus size={18} style={{ color: "var(--gold-accent)" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gold-dark)" }}>
                  Saved Profiles
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-serif)" }}>
                Shortlisted
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {shortlisted.length} profile{shortlisted.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            {shortlisted.length > 0 && (
              <button
                onClick={() => { setShortlisted([]); toast.success("Shortlist cleared"); }}
                className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>

          {shortlisted.length === 0 ? (
            <div className="card p-16 text-center">
              <BookmarkPlus size={48} className="mx-auto mb-4" style={{ color: "var(--border)" }} />
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">No shortlisted profiles</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Save profiles you like and come back to review them.
              </p>
              <Link href="/matches" className="btn btn-primary">
                <Heart size={16} className="fill-current" />
                Browse Matches
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shortlisted.map((profile) => (
                <div key={profile.id} className="relative">
                  <ProfileCard profile={profile} variant="full" />
                  <button
                    onClick={() => remove(profile.id)}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove from shortlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
