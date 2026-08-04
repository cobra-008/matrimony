"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { MOCK_PROFILES, MOCK_GROOM_PROFILES } from "@/data/mock-profiles";
import { RELIGIONS, MOTHER_TONGUES, EDUCATION_LEVELS } from "@/data/matrimony-data";
import { Search, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";

const ALL_BRIDES = MOCK_PROFILES;
const ALL_GROOMS = MOCK_GROOM_PROFILES;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Determine the default opposite gender based on user
  const defaultLookingFor = user?.gender === "female" ? "groom" : "bride";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [lookingFor, setLookingFor] = useState(searchParams.get("looking_for") || defaultLookingFor);
  
  useEffect(() => {
    if (user?.gender) {
      setLookingFor(user.gender === "female" ? "groom" : "bride");
    }
  }, [user?.gender]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("relevance");
  const [filters, setFilters] = useState({
    religion: searchParams.get("religion") || "",
    mother_tongue: "",
    age_min: "18",
    age_max: "45",
    education: "",
    verified_only: false,
  });

  const base = lookingFor === "bride" ? ALL_BRIDES : ALL_GROOMS;

  const filtered = base.filter((p) => {
    if (query) {
      const q = query.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.community.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (filters.religion && p.religion !== filters.religion) return false;
    if (p.age < Number(filters.age_min) || p.age > Number(filters.age_max)) return false;
    if (filters.verified_only && !p.isVerified) return false;
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ q: query, looking_for: lookingFor });
    router.push(`/search/regular?${params.toString()}`);
  };

  const resetFilters = () => setFilters({ religion: "", mother_tongue: "", age_min: "18", age_max: "45", education: "", verified_only: false });

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        {/* Search bar — sticky */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid var(--border-color)",
            padding: "0.75rem 0",
            position: "sticky",
            top: "88px",
            zIndex: 40,
          }}
        >
          <div className="container">
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
              {/* Bride/groom toggle (only if not logged in) */}
              {!user && (
                <div style={{ display: "flex", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0 }}>
                  {["bride", "groom"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setLookingFor(g)}
                      style={{
                        padding: "0.375rem 0.875rem",
                        background: lookingFor === g ? "var(--bm-green)" : "#fff",
                        color: lookingFor === g ? "#fff" : "var(--text-medium)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-sans)",
                        textTransform: "capitalize",
                      }}
                    >
                      {g}s
                    </button>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, location, community, occupation..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ paddingLeft: "2.25rem", paddingRight: query ? "2.25rem" : "0.875rem" }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Search size={14} />
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "1.25rem", paddingBottom: "2.5rem" }}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            {/* Sidebar filters */}
            <aside
              style={{
                width: "220px",
                flexShrink: 0,
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
                position: "sticky",
                top: "160px",
              }}
              className="hidden lg:block"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "5px" }}>
                  <SlidersHorizontal size={14} /> Filters
                </span>
                <button
                  onClick={resetFilters}
                  style={{ fontSize: "0.75rem", color: "var(--bm-orange)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}
                >
                  Reset All
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <label className="form-label">Religion</label>
                  <select className="form-select" style={{ fontSize: "0.8125rem" }} value={filters.religion} onChange={(e) => setFilters({ ...filters, religion: e.target.value })}>
                    <option value="">Any Religion</option>
                    {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Mother Tongue</label>
                  <select className="form-select" style={{ fontSize: "0.8125rem" }} value={filters.mother_tongue} onChange={(e) => setFilters({ ...filters, mother_tongue: e.target.value })}>
                    <option value="">Any</option>
                    {MOTHER_TONGUES.slice(0, 8).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Age From</label>
                  <select className="form-select" style={{ fontSize: "0.8125rem" }} value={filters.age_min} onChange={(e) => setFilters({ ...filters, age_min: e.target.value })}>
                    {Array.from({ length: 35 }, (_, i) => 18 + i).map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Age To</label>
                  <select className="form-select" style={{ fontSize: "0.8125rem" }} value={filters.age_max} onChange={(e) => setFilters({ ...filters, age_max: e.target.value })}>
                    {Array.from({ length: 35 }, (_, i) => 18 + i).map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Education</label>
                  <select className="form-select" style={{ fontSize: "0.8125rem" }} value={filters.education} onChange={(e) => setFilters({ ...filters, education: e.target.value })}>
                    <option value="">Any</option>
                    {EDUCATION_LEVELS.slice(0, 10).map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={filters.verified_only}
                    onChange={(e) => setFilters({ ...filters, verified_only: e.target.checked })}
                    style={{ accentColor: "var(--bm-green)", width: "14px", height: "14px" }}
                  />
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-medium)" }}>Verified profiles only</span>
                </label>
              </div>
            </aside>

            {/* Results */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Results bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", margin: 0 }}>
                  Showing <strong style={{ color: "var(--text-dark)" }}>{filtered.length}</strong> profiles
                  {query && <> for <strong style={{ color: "var(--bm-orange)" }}>&ldquo;{query}&rdquo;</strong></>}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="form-select"
                    style={{ fontSize: "0.75rem", padding: "0.3125rem 1.75rem 0.3125rem 0.5rem", minWidth: "130px" }}
                  >
                    <option value="relevance">Best Match</option>
                    <option value="newest">Newest</option>
                    <option value="age_asc">Age: Low to High</option>
                    <option value="age_desc">Age: High to Low</option>
                  </select>

                  {/* View mode */}
                  <div style={{ display: "flex", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <button
                      onClick={() => setViewMode("grid")}
                      style={{ padding: "0.3125rem 0.5rem", background: viewMode === "grid" ? "var(--bm-green)" : "#fff", color: viewMode === "grid" ? "#fff" : "var(--text-muted)", border: "none", cursor: "pointer" }}
                    >
                      <Grid3X3 size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      style={{ padding: "0.3125rem 0.5rem", background: viewMode === "list" ? "var(--bm-green)" : "#fff", color: viewMode === "list" ? "#fff" : "var(--text-muted)", border: "none", cursor: "pointer" }}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid / List */}
              {filtered.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "3rem", textAlign: "center" }}>
                  <Search size={40} style={{ color: "#CCCCCC", margin: "0 auto 0.875rem" }} />
                  <p style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.375rem" }}>No profiles found</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)" }}>Try a different search or adjust filters.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.875rem" }}>
                  {filtered.map((p) => <ProfileCard key={p.id} profile={p} variant="full" />)}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {filtered.map((p) => <ProfileCard key={p.id} profile={p} variant="compact" />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <p style={{ color: "var(--text-medium)", fontSize: "0.875rem" }}>Loading search...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
