"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Camera, Upload, Trash2, Check, ChevronRight, ChevronDown,
  User, BookOpen, Briefcase, Users, Leaf, MapPin, FileText,
  Heart, Info, Save, Eye, X, Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, addProfilePhoto, deleteProfilePhoto, setProfilePhotoPrimary, type ProfilePhoto } from "@/lib/auth-store";
import { uploadProfilePhoto } from "@/lib/supabase";
import Link from "next/link";
import {
  RELIGIONS, MARITAL_STATUS, MOTHER_TONGUES, EDUCATION_LEVELS,
  OCCUPATIONS, INCOME_RANGES, INDIAN_STATES, COUNTRIES,
  EATING_HABITS, SMOKING_OPTIONS, DRINKING_OPTIONS,
  STARS, RAASI_LIST, DHOSHAM_OPTIONS, HEIGHTS,
  RELIGION_TO_CASTES, CASTE_TO_SUBCASTE,
} from "@/data/matrimony-data";

// ── SECTION META ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: "photo",       label: "Photos & Gallery",      icon: <Camera size={16} /> },
  { id: "basic",       label: "Basic Information",     icon: <User size={16} /> },
  { id: "religion",    label: "Religious Information", icon: <span style={{ fontSize: 14 }}>🕉️</span> },
  { id: "professional",label: "Professional Details",  icon: <Briefcase size={16} /> },
  { id: "family",      label: "Family Details",        icon: <Users size={16} /> },
  { id: "lifestyle",   label: "Lifestyle",             icon: <Leaf size={16} /> },
  { id: "location",    label: "Location",              icon: <MapPin size={16} /> },
  { id: "about",       label: "About Me",              icon: <FileText size={16} /> },
  { id: "partner",     label: "Partner Preferences",   icon: <Heart size={16} /> },
];

// ── FORM FIELD COMPONENTS ─────────────────────────────────────────────
function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-medium)", display: "flex", alignItems: "center", gap: "4px" }}>
        {label}
        {required && <span style={{ color: "var(--primary)" }}>*</span>}
        {hint && (
          <span title={hint} style={{ cursor: "help", color: "#aaa" }}>
            <Info size={12} />
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function FormInput({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="form-input"
      style={{ fontSize: "0.875rem", ...(disabled ? { background: "#f9f9f9", color: "#aaa" } : {}) }}
    />
  );
}

function FormSelect({ value, onChange, options, placeholder = "Select" }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  placeholder?: string;
}) {
  const normalised = (options as (string | { value: string; label: string })[]).map(o =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="form-select"
      style={{ fontSize: "0.875rem" }}
    >
      <option value="">{placeholder}</option>
      {normalised.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── SECTION CARD ─────────────────────────────────────────────────────
function SectionCard({ id, title, icon, children }: {
  id: string; title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        marginBottom: "1.25rem",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        scrollMarginTop: "80px",
      }}
    >
      <div style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--border-light)",
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        background: "#FAFAFA",
      }}>
        <span style={{ color: "var(--primary)" }}>{icon}</span>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </div>
  );
}

// ── GRID ─────────────────────────────────────────────────────────────
function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "1.125rem 1.5rem",
    }}
      className={`edit-grid edit-grid-${cols}`}
    >
      {children}
    </div>
  );
}

function FullWidth({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: "1 / -1" }}>{children}</div>;
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────
function ProfileProgress({ pct }: { pct: number }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-dark)" }}>Profile Completion</span>
        <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--primary)" }}>{pct}%</span>
      </div>
      <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "var(--gradient-hero)", borderRadius: "3px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.375rem" }}>
        Add more details to improve your matches
      </div>
    </div>
  );
}

// ── MULTI-SELECT CHIPS ────────────────────────────────────────────────
function ChipSelect({ options, selected, onToggle }: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {options.map(o => (
        <button
          key={o}
          type="button"
          onClick={() => onToggle(o)}
          style={{
            padding: "0.3125rem 0.875rem",
            border: selected.includes(o) ? "1.5px solid var(--primary)" : "1px solid var(--border-color)",
            borderRadius: "var(--radius-full)",
            background: selected.includes(o) ? "var(--primary-light)" : "#fff",
            color: selected.includes(o) ? "var(--primary)" : "var(--text-medium)",
            fontSize: "0.8125rem",
            fontWeight: selected.includes(o) ? 600 : 400,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "all 0.12s ease",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────
function EditProfileContent() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);

  // Scroll to section from ?section= param
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [searchParams]);

  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState<ProfilePhoto[]>(user?.photos || []);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // § Basic
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState("");
  const [maritalStatus, setMaritalStatus] = useState(user?.maritalStatus || "");
  const [motherTongue, setMotherTongue] = useState(user?.motherTongue || "");

  // § Religion
  const [religion, setReligion] = useState(user?.religion || "");
  const [caste, setCaste] = useState(user?.caste || "");
  const [subCaste, setSubCaste] = useState(user?.subcaste || "");
  const [gothram, setGothram] = useState("");
  const [star, setStar] = useState(user?.star || "");
  const [rasi, setRasi] = useState(user?.rasi || "");
  const [dhosham, setDhosham] = useState(user?.dhosham || "");

  // § Professional
  const [education, setEducation] = useState(user?.education || "");
  const [college, setCollege] = useState("");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [company, setCompany] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [income, setIncome] = useState(user?.income || "");

  // § Family
  const [fatherOcc, setFatherOcc] = useState("");
  const [motherOcc, setMotherOcc] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [brothers, setBrothers] = useState("0");
  const [sisters, setSisters] = useState("0");

  // § Lifestyle
  const [diet, setDiet] = useState(user?.diet || "");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [disabilities, setDisabilities] = useState("None");
  const [languages, setLanguages] = useState<string[]>(["Tamil"]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // § Location
  const [country, setCountry] = useState(user?.country || "India");
  const [state, setState] = useState(user?.state || "");
  const [city, setCity] = useState(user?.city || "");
  const [nativePlace, setNativePlace] = useState("");
  const [address, setAddress] = useState("");

  // § About
  const [about, setAbout] = useState(user?.about || "");

  // § Partner
  const [pAgeMin, setPAgeMin] = useState(String(user?.partnerAgeMin || 22));
  const [pAgeMax, setPAgeMax] = useState(String(user?.partnerAgeMax || 35));
  const [pReligion, setPReligion] = useState(user?.partnerReligion || "");
  const [pCaste, setPCaste] = useState(user?.partnerCaste || "");
  const [pEducation, setPEducation] = useState("");
  const [pOccupation, setPOccupation] = useState("");
  const [pIncome, setPIncome] = useState("");
  const [pHeightMin, setPHeightMin] = useState("152");
  const [pHeightMax, setPHeightMax] = useState("193");
  const [pMotherTongue, setPMotherTongue] = useState<string[]>([]);
  const [pMaritalStatus, setPMaritalStatus] = useState<string[]>([]);
  const [pCountry, setPCountry] = useState("India");

  // Compute profile completion
  const fields = [firstName, gender, dob, religion, caste, education, occupation, city, about, gallery.some(p => p.isPrimary)];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

  // Available castes/subcastes from selection
  const availCastes = religion && RELIGION_TO_CASTES[religion]
    ? RELIGION_TO_CASTES[religion].map(c => ({ value: c, label: c }))
    : [];
  const availSubCastes = caste && CASTE_TO_SUBCASTE[caste]
    ? CASTE_TO_SUBCASTE[caste].map(s => ({ value: s, label: s }))
    : [];

  const HEIGHT_OPTS = HEIGHTS.map(h => ({ value: String(h.value), label: h.label }));
  const AGE_OPTS = Array.from({ length: 43 }, (_, i) => ({ value: String(i + 18), label: `${i + 18} yrs` }));

  const HOBBIES_LIST = ["Reading", "Music", "Dance", "Travel", "Cooking", "Movies", "Sports", "Art", "Yoga", "Photography", "Gaming", "Trekking"];
  const INTERESTS_LIST = ["Carnatic Music", "Classical Dance", "Temple Visits", "Spirituality", "Volunteering", "Gardening", "Coding", "Fashion", "Food Blog", "Fitness"];
  const LANG_LIST = ["Tamil", "English", "Hindi", "Telugu", "Malayalam", "Kannada", "Sanskrit"];

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5 MB"); return; }
    
    // Check limit
    if (gallery.length >= 8) { toast.error("Maximum 8 photos allowed (1 primary + 7 gallery)"); return; }
    
    setUploadingGallery(true);
    const toastId = toast.loading("Uploading photo...");
    try {
      const url = await uploadProfilePhoto(user.id, file);
      const isPrimary = gallery.length === 0;
      const newPhoto = await addProfilePhoto(user.id, url, isPrimary, gallery.length);
      if (newPhoto) {
        setGallery([...gallery, newPhoto]);
        if (isPrimary) await refresh();
        toast.success("Photo uploaded!", { id: toastId });
      } else {
        throw new Error("Failed to save to DB");
      }
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploadingGallery(false);
      if (e.target) e.target.value = ''; // reset input
    }
  };

  const handleSetPrimary = async (photoId: string, url: string) => {
    if (!user) return;
    const toastId = toast.loading("Setting as primary...");
    try {
      const success = await setProfilePhotoPrimary(photoId, user.id, url);
      if (success) {
        setGallery(gallery.map(p => ({ ...p, isPrimary: p.id === photoId, sortOrder: p.id === photoId ? 0 : 1 })));
        await refresh();
        toast.success("Primary photo updated", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to set primary", { id: toastId });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!user) return;
    const toastId = toast.loading("Deleting photo...");
    try {
      const success = await deleteProfilePhoto(photoId);
      if (success) {
        const photo = gallery.find(p => p.id === photoId);
        setGallery(gallery.filter(p => p.id !== photoId));
        if (photo?.isPrimary) {
           await updateProfile(user.id, { photoUrl: "" });
           await refresh();
        }
        toast.success("Photo deleted", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleSave = useCallback(async () => {
    if (!firstName.trim()) { toast.error("First name is required"); return; }
    if (!dob) { toast.error("Date of birth is required"); return; }

    setSaving(true);

    try {
      if (!user) throw new Error("Not logged in");

      await updateProfile(user.id, {
        name: `${firstName} ${lastName}`.trim(),
        gender: gender as "male" | "female",
        dob,
        height,
        maritalStatus,
        motherTongue,
        religion,
        caste,
        subcaste: subCaste,
        gothram,
        star,
        rasi,
        dhosham,
        education,
        college,
        occupation,
        company,
        employmentType,
        income,
        diet,
        smoking,
        drinking,
        disabilities,
        languages,
        hobbies,
        interests,
        country,
        state,
        city,
        nativePlace,
        about,
        partnerAgeMin: parseInt(pAgeMin),
        partnerAgeMax: parseInt(pAgeMax),
        partnerReligion: pReligion || undefined,
        partnerCaste: pCaste || undefined,
        partnerEducation: pEducation || undefined,
        partnerOccupation: pOccupation || undefined,
        partnerIncome: pIncome || undefined,
        partnerHeightMin: pHeightMin || undefined,
        partnerHeightMax: pHeightMax || undefined,
        partnerCountry: pCountry || undefined,
        partnerMaritalStatus: pMaritalStatus,
        partnerMotherTongue: pMotherTongue,
        fatherOccupation: fatherOcc || undefined,
        motherOccupation: motherOcc || undefined,
        familyStatus: familyStatus || undefined,
        familyType: familyType || undefined,
        brothers: parseInt(brothers),
        sisters: parseInt(sisters),
      });

      await refresh();
      toast.success("Saved successfully! ✓");
      // Go back to wherever they came from
      setTimeout(() => router.back(), 500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [
    user, firstName, lastName, gender, dob, height, maritalStatus, motherTongue,
    religion, caste, subCaste, gothram, star, rasi, dhosham, education, college,
    occupation, company, employmentType, income, diet, smoking, drinking, disabilities,
    languages, hobbies, interests, country, state, city, nativePlace, about,
    gallery, pAgeMin, pAgeMax, pReligion, pCaste, pEducation, pOccupation,
    pIncome, pHeightMin, pHeightMax, pCountry, pMaritalStatus, pMotherTongue,
    fatherOcc, motherOcc, familyStatus, familyType, brothers, sisters, refresh, router,
  ]);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem 6rem" }}>

          {/* ── Page header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>Edit Profile</h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "3px" }}>Update your information to get better matches</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href={user ? `/profile/${user.id}` : "/matches"} className="btn btn-ghost" style={{ border: "1.5px solid var(--border-color)", display: "flex", alignItems: "center", gap: "5px" }}>
                <Eye size={14} /> Preview
              </Link>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "140px", justifyContent: "center" }}>
                {saving ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> Saving…</> : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            {/* ── Sticky Left Nav ── */}
            <aside style={{ width: "220px", flexShrink: 0, background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)", position: "sticky", top: "80px" }}>
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-light)" }}>
                <ProfileProgress pct={pct} />
              </div>
              <nav>
                {SECTIONS.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.625rem",
                      padding: "0.75rem 1rem", textDecoration: "none",
                      color: "var(--text-dark)", fontSize: "0.8125rem", fontWeight: 500,
                      borderBottom: "1px solid var(--border-light)",
                      transition: "all 0.12s",
                    }}
                    className="edit-nav-item"
                  >
                    <span style={{ color: "var(--primary)", flexShrink: 0 }}>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* ── Main Form ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* ─────────────────────────────────────────────────────
                  § 1  PROFILE PHOTO
              ───────────────────────────────────────────────────── */}
              <SectionCard id="photo" title="Photos & Gallery" icon={<Camera size={16} />}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
                    {gallery.sort((a, b) => a.sortOrder - b.sortOrder).map(photo => (
                      <div key={photo.id} style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", border: photo.isPrimary ? "2px solid var(--primary)" : "1px solid var(--border-color)", aspectRatio: "3/4" }}>
                        <img src={photo.url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {photo.isPrimary && (
                          <div style={{ position: "absolute", top: "8px", left: "8px", background: "var(--primary)", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600 }}>Primary</div>
                        )}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "8px", display: "flex", justifyContent: "space-around", backdropFilter: "blur(4px)" }}>
                          {!photo.isPrimary && (
                            <button onClick={(e) => { e.preventDefault(); handleSetPrimary(photo.id, photo.url); }} style={{ color: "white", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Check size={14} /> Set Primary
                            </button>
                          )}
                          <button onClick={(e) => { e.preventDefault(); handleDeletePhoto(photo.id); }} style={{ color: "#ffcdd2", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {gallery.length < 8 && (
                      <div onClick={() => !uploadingGallery && document.getElementById('gallery-upload')?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-xl)", border: "2px dashed var(--border-color)", aspectRatio: "3/4", cursor: uploadingGallery ? "not-allowed" : "pointer", background: "#f9f9f9", gap: "0.5rem", color: "var(--text-medium)" }}>
                        {uploadingGallery ? <span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> : <Plus size={24} />}
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{uploadingGallery ? "Uploading..." : "Add Photo"}</span>
                        <span style={{ fontSize: "0.7rem" }}>{8 - gallery.length} remaining</span>
                      </div>
                    )}
                  </div>
                  <input id="gallery-upload" type="file" accept="image/*" onChange={handleGalleryUpload} style={{ display: "none" }} />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5, background: "#f5f5f5", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
                    <strong>Guidelines:</strong> JPG, PNG or WEBP · Max 5 MB per photo · Minimum 300×300 pixels.<br />
                    You can add up to 8 photos. <strong>Profiles with more photos get 8x more views.</strong>
                  </div>
                </div>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 2  BASIC INFORMATION
              ───────────────────────────────────────────────────── */}
              <SectionCard id="basic" title="Basic Information" icon={<User size={16} />}>
                <FieldGrid>
                  <FormField label="First Name" required>
                    <FormInput value={firstName} onChange={setFirstName} placeholder="Enter first name" />
                  </FormField>
                  <FormField label="Last Name">
                    <FormInput value={lastName} onChange={setLastName} placeholder="Enter last name" />
                  </FormField>
                  <FormField label="Gender" required>
                    <FormSelect
                      value={gender}
                      onChange={setGender}
                      options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
                      placeholder="Select gender"
                    />
                  </FormField>
                  <FormField label="Date of Birth" required>
                    <FormInput type="date" value={dob} onChange={setDob} />
                  </FormField>
                  <FormField label="Height" hint="Used for partner matching">
                    <FormSelect value={height} onChange={setHeight} options={HEIGHT_OPTS} placeholder="Select height" />
                  </FormField>
                  <FormField label="Weight (kg)">
                    <FormInput value={weight} onChange={setWeight} placeholder="e.g. 65" type="number" />
                  </FormField>
                  <FormField label="Marital Status" required>
                    <FormSelect value={maritalStatus} onChange={setMaritalStatus} options={MARITAL_STATUS} placeholder="Select status" />
                  </FormField>
                  <FormField label="Mother Tongue" required>
                    <FormSelect value={motherTongue} onChange={setMotherTongue} options={MOTHER_TONGUES} placeholder="Select language" />
                  </FormField>
                </FieldGrid>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 3  RELIGIOUS INFORMATION
              ───────────────────────────────────────────────────── */}
              <SectionCard id="religion" title="Religious Information" icon={<span style={{ fontSize: 14 }}>🕉️</span>}>
                <FieldGrid>
                  <FormField label="Religion" required>
                    <FormSelect value={religion} onChange={v => { setReligion(v); setCaste(""); setSubCaste(""); }} options={RELIGIONS} placeholder="Select religion" />
                  </FormField>
                  <FormField label="Caste / Community">
                    <FormSelect value={caste} onChange={v => { setCaste(v); setSubCaste(""); }} options={availCastes} placeholder={religion ? "Select caste" : "Select religion first"} />
                  </FormField>
                  <FormField label="Sub Caste">
                    <FormSelect value={subCaste} onChange={setSubCaste} options={availSubCastes} placeholder={caste ? "Select sub caste" : "Select caste first"} />
                  </FormField>
                  <FormField label="Gothram">
                    <FormInput value={gothram} onChange={setGothram} placeholder="Enter gothram (optional)" />
                  </FormField>
                  <FormField label="Star (Natchathiram)">
                    <FormSelect value={star} onChange={setStar} options={STARS} placeholder="Select star" />
                  </FormField>
                  <FormField label="Raasi">
                    <FormSelect value={rasi} onChange={setRasi} options={RAASI_LIST} placeholder="Select raasi" />
                  </FormField>
                  <FormField label="Dhosham">
                    <FormSelect value={dhosham} onChange={setDhosham} options={DHOSHAM_OPTIONS} placeholder="Select" />
                  </FormField>
                  <FormField label="Upload Horoscope" hint="PDF or JPG of your jathagam">
                    <button
                      type="button"
                      onClick={() => toast("Horoscope upload coming soon")}
                      style={{ width: "100%", background: "#fafafa", border: "2px dashed var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.75rem", cursor: "pointer", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                      <Upload size={14} /> Upload Horoscope (PDF/JPG)
                    </button>
                  </FormField>
                </FieldGrid>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 4  PROFESSIONAL DETAILS
              ───────────────────────────────────────────────────── */}
              <SectionCard id="professional" title="Professional Details" icon={<Briefcase size={16} />}>
                <FieldGrid>
                  <FormField label="Highest Education" required>
                    <FormSelect value={education} onChange={setEducation} options={EDUCATION_LEVELS} placeholder="Select qualification" />
                  </FormField>
                  <FormField label="College / University">
                    <FormInput value={college} onChange={setCollege} placeholder="e.g. IIT Madras" />
                  </FormField>
                  <FormField label="Occupation" required>
                    <FormSelect value={occupation} onChange={setOccupation} options={OCCUPATIONS} placeholder="Select occupation" />
                  </FormField>
                  <FormField label="Company / Organisation">
                    <FormInput value={company} onChange={setCompany} placeholder="e.g. Infosys" />
                  </FormField>
                  <FormField label="Employment Type">
                    <FormSelect value={employmentType} onChange={setEmploymentType} options={["Private Sector", "Government / PSU", "Self Employed", "Business Owner", "Defence / Civil Services", "Not Working"]} placeholder="Select type" />
                  </FormField>
                  <FormField label="Annual Income">
                    <FormSelect value={income} onChange={setIncome} options={INCOME_RANGES} placeholder="Select income range" />
                  </FormField>
                </FieldGrid>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 5  FAMILY DETAILS
              ───────────────────────────────────────────────────── */}
              <SectionCard id="family" title="Family Details" icon={<Users size={16} />}>
                <FieldGrid>
                  <FormField label="Father's Occupation">
                    <FormSelect value={fatherOcc} onChange={setFatherOcc} options={["Business", "Government Employee", "Private Employee", "Retired", "Farmer", "Other", "Late"]} placeholder="Select" />
                  </FormField>
                  <FormField label="Mother's Occupation">
                    <FormSelect value={motherOcc} onChange={setMotherOcc} options={["Homemaker", "Business", "Government Employee", "Private Employee", "Retired", "Other", "Late"]} placeholder="Select" />
                  </FormField>
                  <FormField label="Family Status">
                    <FormSelect value={familyStatus} onChange={setFamilyStatus} options={["Rich / Affluent", "Upper Middle Class", "Middle Class", "Lower Middle Class"]} placeholder="Select" />
                  </FormField>
                  <FormField label="Family Type">
                    <FormSelect value={familyType} onChange={setFamilyType} options={["Joint Family", "Nuclear Family"]} placeholder="Select" />
                  </FormField>
                  <FormField label="Number of Brothers">
                    <FormSelect value={brothers} onChange={setBrothers} options={Array.from({ length: 6 }, (_, i) => String(i))} />
                  </FormField>
                  <FormField label="Number of Sisters">
                    <FormSelect value={sisters} onChange={setSisters} options={Array.from({ length: 6 }, (_, i) => String(i))} />
                  </FormField>
                </FieldGrid>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 6  LIFESTYLE
              ───────────────────────────────────────────────────── */}
              <SectionCard id="lifestyle" title="Lifestyle" icon={<Leaf size={16} />}>
                <FieldGrid>
                  <FormField label="Food Preference">
                    <FormSelect value={diet} onChange={setDiet} options={EATING_HABITS} placeholder="Select" />
                  </FormField>
                  <FormField label="Smoking Habits">
                    <FormSelect value={smoking} onChange={setSmoking} options={SMOKING_OPTIONS} placeholder="Select" />
                  </FormField>
                  <FormField label="Drinking Habits">
                    <FormSelect value={drinking} onChange={setDrinking} options={DRINKING_OPTIONS} placeholder="Select" />
                  </FormField>
                  <FormField label="Disabilities / Special Needs">
                    <FormSelect value={disabilities} onChange={setDisabilities} options={["None", "Physically Challenged", "Visually Impaired", "Hearing Impaired", "Other"]} />
                  </FormField>
                </FieldGrid>

                <div style={{ marginTop: "1.25rem" }}>
                  <FormField label="Languages Known">
                    <ChipSelect options={LANG_LIST} selected={languages} onToggle={v => setLanguages(prev => prev.includes(v) ? prev.filter(l => l !== v) : [...prev, v])} />
                  </FormField>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <FormField label="Hobbies">
                    <ChipSelect options={HOBBIES_LIST} selected={hobbies} onToggle={v => setHobbies(prev => prev.includes(v) ? prev.filter(h => h !== v) : [...prev, v])} />
                  </FormField>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <FormField label="Interests">
                    <ChipSelect options={INTERESTS_LIST} selected={interests} onToggle={v => setInterests(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v])} />
                  </FormField>
                </div>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 7  LOCATION
              ───────────────────────────────────────────────────── */}
              <SectionCard id="location" title="Location" icon={<MapPin size={16} />}>
                <FieldGrid>
                  <FormField label="Country" required>
                    <FormSelect value={country} onChange={setCountry} options={COUNTRIES} />
                  </FormField>
                  <FormField label="State">
                    <FormSelect value={state} onChange={setState} options={INDIAN_STATES} placeholder="Select state" />
                  </FormField>
                  <FormField label="City" required>
                    <FormInput value={city} onChange={setCity} placeholder="e.g. Chennai" />
                  </FormField>
                  <FormField label="Native Place">
                    <FormInput value={nativePlace} onChange={setNativePlace} placeholder="e.g. Madurai" />
                  </FormField>
                  <FullWidth>
                    <FormField label="Current Address">
                      <textarea
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Enter your current address (optional)"
                        rows={2}
                        style={{ width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.625rem 0.875rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--text-dark)", resize: "vertical", outline: "none", lineHeight: 1.5 }}
                        onFocus={e => e.target.style.borderColor = "var(--primary)"}
                        onBlur={e => e.target.style.borderColor = "var(--border-color)"}
                      />
                    </FormField>
                  </FullWidth>
                </FieldGrid>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 8  ABOUT ME
              ───────────────────────────────────────────────────── */}
              <SectionCard id="about" title="About Me" icon={<FileText size={16} />}>
                <FormField label="Write about yourself" hint="Tell prospects about your values, family and what you're looking for">
                  <div style={{ position: "relative" }}>
                    <textarea
                      value={about}
                      onChange={e => setAbout(e.target.value.slice(0, 500))}
                      placeholder="Share a little about yourself — your personality, family values, career goals and what you are looking for in a life partner…"
                      rows={6}
                      style={{ width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--text-dark)", resize: "vertical", outline: "none", lineHeight: 1.65 }}
                      onFocus={e => e.target.style.borderColor = "var(--primary)"}
                      onBlur={e => e.target.style.borderColor = "var(--border-color)"}
                    />
                    <div style={{ textAlign: "right", fontSize: "0.75rem", color: about.length > 450 ? "var(--primary)" : "#aaa", marginTop: "4px" }}>
                      {about.length} / 500 characters
                    </div>
                  </div>
                </FormField>
              </SectionCard>

              {/* ─────────────────────────────────────────────────────
                  § 9  PARTNER PREFERENCES
              ───────────────────────────────────────────────────── */}
              <SectionCard id="partner" title="Partner Preferences" icon={<Heart size={16} />}>
                <div style={{ background: "var(--primary-light)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                  <Info size={14} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Your partner preferences help us show you more relevant matches. Be as specific or broad as you like.
                  </p>
                </div>

                <FieldGrid>
                  {/* Age Range */}
                  <FormField label="Age Range">
                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                      <FormSelect value={pAgeMin} onChange={setPAgeMin} options={AGE_OPTS} placeholder="From" />
                      <span style={{ color: "#aaa", fontSize: "0.8125rem", flexShrink: 0 }}>to</span>
                      <FormSelect value={pAgeMax} onChange={setPAgeMax} options={AGE_OPTS} placeholder="To" />
                    </div>
                  </FormField>

                  {/* Height Range */}
                  <FormField label="Height Range">
                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                      <FormSelect value={pHeightMin} onChange={setPHeightMin} options={HEIGHT_OPTS} placeholder="Min" />
                      <span style={{ color: "#aaa", fontSize: "0.8125rem", flexShrink: 0 }}>to</span>
                      <FormSelect value={pHeightMax} onChange={setPHeightMax} options={HEIGHT_OPTS} placeholder="Max" />
                    </div>
                  </FormField>

                  <FormField label="Religion">
                    <FormSelect value={pReligion} onChange={setPReligion} options={RELIGIONS} placeholder="Any religion" />
                  </FormField>

                  <FormField label="Caste">
                    <FormInput value={pCaste} onChange={setPCaste} placeholder="Any / specific caste" />
                  </FormField>

                  <FormField label="Education">
                    <FormSelect value={pEducation} onChange={setPEducation} options={EDUCATION_LEVELS} placeholder="Any" />
                  </FormField>

                  <FormField label="Occupation">
                    <FormSelect value={pOccupation} onChange={setPOccupation} options={OCCUPATIONS} placeholder="Any" />
                  </FormField>

                  <FormField label="Annual Income">
                    <FormSelect value={pIncome} onChange={setPIncome} options={INCOME_RANGES} placeholder="Any" />
                  </FormField>

                  <FormField label="Country">
                    <FormSelect value={pCountry} onChange={setPCountry} options={COUNTRIES} />
                  </FormField>
                </FieldGrid>

                <div style={{ marginTop: "1.25rem" }}>
                  <FormField label="Mother Tongue">
                    <ChipSelect options={LANG_LIST} selected={pMotherTongue} onToggle={v => setPMotherTongue(prev => prev.includes(v) ? prev.filter(l => l !== v) : [...prev, v])} />
                  </FormField>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <FormField label="Marital Status">
                    <ChipSelect
                      options={MARITAL_STATUS.map(m => m.label)}
                      selected={pMaritalStatus}
                      onToggle={v => setPMaritalStatus(prev => prev.includes(v) ? prev.filter(m => m !== v) : [...prev, v])}
                    />
                  </FormField>
                </div>
              </SectionCard>

            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky bottom save bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid var(--border-color)",
        padding: "0.875rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 50, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            Profile completion: <strong style={{ color: "var(--primary)" }}>{pct}%</strong>
          </div>
          <div style={{ width: "100px", height: "5px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--gradient-hero)", borderRadius: "3px", transition: "width 0.4s" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/matches" className="btn btn-ghost" style={{ border: "1.5px solid var(--border-color)" }}>
            Cancel
          </Link>
          <Link href={user ? `/profile/${user.id}` : "/matches"} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Eye size={13} /> Preview Profile
          </Link>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "150px", justifyContent: "center" }}>
            {saving ? "Saving…" : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>

      <style>{`
        .edit-grid-2 { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 640px) {
          .edit-grid-2 { grid-template-columns: 1fr !important; }
          aside { display: none; }
        }
        .edit-nav-item:hover { background: var(--primary-light); color: var(--primary); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <Footer />
    </>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-page)" }} />}>
      <EditProfileContent />
    </Suspense>
  );
}
