"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  const [konamiCount, setKonamiCount] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);
  const [tipIndex, setTipIndex] = useState(0);

  const funnyTips = [
    "Try entering a valid URL — unlike matrimony, URLs have to be an exact match.",
    "This page is as lost as someone who forgot their horoscope on a first meeting.",
    "404 is like a kundali mismatch — some things just aren't meant to be.",
    "Even our algorithm couldn't find a match for that URL.",
    "This is rarer than finding a profile that says 'I actually enjoy morning walks'.",
    "Your URL has been ghosted. We know the feeling.",
    "The page you're looking for has gone abroad like every eligible Tamil bachelor.",
  ];

  // Cycle through tips every 4s
  useEffect(() => {
    const t = setInterval(() => {
      setTipIndex((i) => (i + 1) % funnyTips.length);
    }, 4000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Konami code easter egg: ↑↑↓↓←→←→BA
  useEffect(() => {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let idx = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === sequence[idx]) {
        idx++;
        setKonamiCount(idx);
        if (idx === sequence.length) {
          setEasterEgg(true);
          idx = 0;
          // Generate confetti
          const pieces = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: ["#6B1A2A", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"][Math.floor(Math.random() * 6)],
            delay: Math.random() * 1.5,
          }));
          setConfetti(pieces);
          setTimeout(() => { setEasterEgg(false); setConfetti([]); }, 5000);
        }
      } else {
        idx = 0;
        setKonamiCount(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Navbar />

      {/* Confetti easter egg */}
      {easterEgg && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
          {confetti.map((c) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                top: "-20px",
                left: `${c.x}%`,
                width: "10px",
                height: "10px",
                background: c.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animation: `confettiFall 2s ${c.delay}s ease-in forwards`,
              }}
            />
          ))}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(107,26,42,0.95)",
              color: "#fff",
              borderRadius: "16px",
              padding: "2rem 2.5rem",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              zIndex: 10000,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎊</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>Konami Code Activated!</div>
            <div style={{ fontSize: "0.9375rem", opacity: 0.85 }}>
              You found the Easter Egg! Unfortunately, we still can&apos;t find that page. 😅
            </div>
          </div>
        </div>
      )}

      <main
        style={{
          minHeight: "calc(100vh - 70px)",
          background: "linear-gradient(135deg, #fdf2f4 0%, #fff7f0 50%, #f0f4ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Animated 404 number */}
          <div style={{ position: "relative", userSelect: "none" }}>
            <div
              style={{
                fontSize: "clamp(7rem, 25vw, 10rem)",
                fontWeight: 900,
                lineHeight: 1,
                background: "linear-gradient(135deg, var(--primary) 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 20px rgba(107,26,42,0.15))",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              404
            </div>
            {/* Decorative hearts */}
            <span
              style={{
                position: "absolute",
                top: "-10px",
                right: "-20px",
                fontSize: "2rem",
                animation: "heartbeat 1.4s ease-in-out infinite",
              }}
              aria-hidden="true"
            >
              💔
            </span>
          </div>

          {/* Main message */}
          <div>
            <h1
              style={{
                fontSize: "clamp(1.375rem, 4vw, 1.875rem)",
                fontWeight: 800,
                color: "var(--text-dark)",
                margin: "0 0 0.75rem",
                lineHeight: 1.3,
              }}
            >
              Oops! This Page Ran Away Before the Wedding 🏃
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-medium)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "480px",
              }}
            >
              The page you&apos;re looking for doesn&apos;t exist. Much like the &ldquo;perfect match&rdquo; everyone&apos;s
              amma described — sounds great, nowhere to be found.
            </p>
          </div>

          {/* Rotating funny tips */}
          <div
            style={{
              background: "#fff",
              border: "1.5px dashed var(--primary)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              maxWidth: "440px",
              boxShadow: "0 4px 20px rgba(107,26,42,0.08)",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-medium)",
                margin: 0,
                lineHeight: 1.6,
                fontStyle: "italic",
                transition: "opacity 0.3s ease",
              }}
            >
              💭 <em>{funnyTips[tipIndex]}</em>
            </p>
          </div>

          {/* Illustrated character */}
          <div aria-hidden="true" style={{ margin: "0.5rem 0" }}>
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              style={{ animation: "float 3s ease-in-out infinite" }}
            >
              {/* Body */}
              <ellipse cx="80" cy="110" rx="30" ry="35" fill="#6B1A2A" opacity="0.15" />
              {/* Head */}
              <circle cx="80" cy="65" r="28" fill="#FBBF24" />
              {/* Eyes — looking around */}
              <circle cx="71" cy="62" r="5" fill="#fff" />
              <circle cx="89" cy="62" r="5" fill="#fff" />
              <circle cx="73" cy="63" r="2.5" fill="#1F2937" />
              <circle cx="91" cy="63" r="2.5" fill="#1F2937" />
              {/* Sad mouth */}
              <path d="M72 75 Q80 70 88 75" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Question marks */}
              <text x="22" y="50" fontSize="20" fill="#6B1A2A" opacity="0.5" style={{ animation: "float 2.5s ease-in-out infinite 0.5s" }}>?</text>
              <text x="120" y="55" fontSize="16" fill="#F59E0B" opacity="0.7" style={{ animation: "float 3.2s ease-in-out infinite 1s" }}>?</text>
              <text x="110" y="90" fontSize="14" fill="#6B1A2A" opacity="0.4" style={{ animation: "float 2.8s ease-in-out infinite 0.3s" }}>?</text>
              {/* Map/scroll */}
              <rect x="58" y="92" width="44" height="32" rx="4" fill="#fff" stroke="#6B1A2A" strokeWidth="1.5" />
              <line x1="65" y1="103" x2="95" y2="103" stroke="#6B1A2A" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="65" y1="111" x2="88" y2="111" stroke="#6B1A2A" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="93" cy="114" r="3" fill="#EF4444" />
            </svg>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/"
              className="btn btn-primary"
              style={{ minWidth: "180px", justifyContent: "center" }}
              id="not-found-home-btn"
            >
              🏠 Take Me Home
            </Link>
            <Link
              href="/matches"
              className="btn btn-green"
              style={{ minWidth: "180px", justifyContent: "center" }}
              id="not-found-matches-btn"
            >
              💕 Find a Match Instead
            </Link>
          </div>

          {/* Konami hint */}
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              opacity: 0.6,
              margin: 0,
              transition: "opacity 0.3s",
            }}
          >
            🎮 {konamiCount > 0 ? `${konamiCount}/10 — keep going...` : "Psst... try the Konami code for a surprise"}
          </p>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}
