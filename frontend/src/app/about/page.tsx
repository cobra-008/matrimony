import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Elite Tamil Matrimony',
  description: 'Learn about Elite Tamil Matrimony — a dedicated platform helping Tamil individuals and families find meaningful marriage relationships.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg-page)', minHeight: '70vh' }}>
        {/* Hero */}
        <section
          style={{
            background: 'var(--gradient-hero)',
            padding: '3.5rem 0',
            textAlign: 'center',
          }}
        >
          <div className="container">
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 900,
                color: '#fff',
                margin: '0 0 0.75rem',
                lineHeight: 1.2,
              }}
            >
              About Elite Tamil Matrimony
            </h1>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.85)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.65,
              }}
            >
              A trusted matrimonial platform built exclusively for Tamil individuals and families, focused on meaningful connections and lifelong partnerships.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section style={{ background: '#fff', padding: '3rem 0', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container" style={{ maxWidth: '760px' }}>
            <h2
              style={{
                fontSize: '1.375rem',
                fontWeight: 900,
                color: 'var(--text-dark)',
                marginBottom: '1rem',
              }}
            >
              Our Mission
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-medium)', lineHeight: 1.75, marginBottom: '1rem' }}>
              Elite Tamil Matrimony was founded with a single purpose: to help Tamil-speaking individuals and families find compatible life partners in a respectful, privacy-first environment.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-medium)', lineHeight: 1.75, marginBottom: '1rem' }}>
              We understand that marriage is one of the most important decisions in a person's life. Our platform is designed to make the process of discovering, evaluating, and connecting with potential matches as meaningful and stress-free as possible.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-medium)', lineHeight: 1.75 }}>
              We are a newly launched platform, built with modern technology and a deep respect for Tamil culture and family values. Every feature is designed with your privacy and wellbeing in mind.
            </p>
          </div>
        </section>

        {/* Values */}
        <section style={{ background: 'var(--bg-page)', padding: '3rem 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <h2
              style={{
                fontSize: '1.375rem',
                fontWeight: 900,
                color: 'var(--text-dark)',
                marginBottom: '1.75rem',
                textAlign: 'center',
              }}
            >
              What We Stand For
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[
                {
                  title: 'Privacy First',
                  desc: 'Your personal details are protected. Profile photos are blurred for unregistered visitors. You control who sees your contact information.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
                      <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7z" />
                      <polyline points="9 12 11 14 15 10" strokeWidth="2" />
                    </svg>
                  ),
                },
                {
                  title: 'Verified Profiles',
                  desc: 'All profiles are verified via mobile OTP. We encourage members to complete identity verification for a safer community.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                      <polyline points="16 11 17.5 12.5 21 9" strokeWidth="2" />
                    </svg>
                  ),
                },
                {
                  title: 'Smart Matching',
                  desc: 'Our compatibility engine scores potential matches based on shared values, lifestyle, and life goals — not just demographics.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                },
                {
                  title: 'Tamil Community Focus',
                  desc: 'Built exclusively for the Tamil community. We understand the cultural nuances, traditions, and values that matter to Tamil families.',
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>{item.icon}</div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-dark)',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {item.title}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          style={{
            background: 'var(--gradient-hero)',
            padding: '2.5rem 0',
            textAlign: 'center',
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Have questions or feedback? We'd love to hear from you.
            </p>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff',
                color: 'var(--primary)',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
