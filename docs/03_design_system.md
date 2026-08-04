# 03 — Design System

## Brand Identity
**Brand Name**: Elite Tamil Matrimony
**Tagline**: "Find Your Perfect Tamil Match — Trusted, Verified, Intelligent"
**Brand Personality**: Warm, Trustworthy, Premium, Culturally Rooted, Modern

---

## Color System

### Primary Palette
| Token | HSL | Hex | Usage |
|---|---|---|---|
| `rose-primary` | hsl(340, 68%, 40%) | #A8294E | CTAs, headings, accent text |
| `rose-light` | hsl(340, 68%, 50%) | #C23560 | Hover states, icons |
| `rose-dark` | hsl(340, 68%, 28%) | #751D37 | Pressed states |

### Accent Palette
| Token | HSL | Hex | Usage |
|---|---|---|---|
| `gold-accent` | hsl(38, 95%, 52%) | #F5A623 | Premium badges, CTA highlights |
| `gold-light` | hsl(38, 95%, 65%) | #F8C06A | Soft highlight backgrounds |
| `saffron` | hsl(28, 88%, 56%) | #F07830 | Energy accents, notification dots |

### Neutral Palette
| Token | HSL | Hex | Usage |
|---|---|---|---|
| `cream-bg` | hsl(40, 40%, 97%) | #FBF8F3 | Page backgrounds |
| `surface` | hsl(0, 0%, 100%) | #FFFFFF | Card backgrounds |
| `border` | hsl(35, 20%, 88%) | #E8E0D4 | Subtle borders |
| `text-primary` | hsl(220, 20%, 15%) | #1E2433 | Main text |
| `text-secondary` | hsl(220, 10%, 45%) | #666E80 | Secondary text |
| `text-muted` | hsl(220, 10%, 65%) | #9AA0B0 | Placeholder, muted text |

### Dark Mode Palette
| Token | HSL | Hex | Usage |
|---|---|---|---|
| `dark-bg` | hsl(225, 25%, 10%) | #131825 | Dark page background |
| `dark-surface` | hsl(225, 20%, 15%) | #1C2535 | Dark card surface |
| `dark-border` | hsl(225, 15%, 22%) | #2B3447 | Dark borders |

### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `success` | #22C55E | Verified badges, success messages |
| `warning` | #F59E0B | Pending verification, alerts |
| `error` | #EF4444 | Errors, blocked status |
| `info` | #3B82F6 | Info banners |

---

## Typography

### Font Families
```css
/* Headings - Elegant serif, premium feel */
font-family: 'Playfair Display', Georgia, serif;

/* Body - Clean, highly legible */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display-xl` | 3.5rem (56px) | 1.1 | 700 | Hero headline |
| `display-lg` | 2.75rem (44px) | 1.15 | 700 | Page headings |
| `heading-xl` | 2rem (32px) | 1.25 | 600 | Section headings |
| `heading-lg` | 1.5rem (24px) | 1.3 | 600 | Card headings |
| `heading-md` | 1.25rem (20px) | 1.4 | 600 | Sub-headings |
| `body-lg` | 1.125rem (18px) | 1.6 | 400 | Lead text |
| `body-md` | 1rem (16px) | 1.6 | 400 | Body copy |
| `body-sm` | 0.875rem (14px) | 1.5 | 400 | Secondary text |
| `caption` | 0.75rem (12px) | 1.4 | 400 | Labels, captions |

---

## Spacing & Layout

### Spacing Scale (Tailwind extension)
- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px
- `8` = 32px, `10` = 40px, `12` = 48px, `16` = 64px, `20` = 80px, `24` = 96px

### Container Widths
- Max content width: `1280px` (7xl)
- Wide content: `1024px` (4xl/5xl)
- Narrow content: `768px` (3xl)
- Form width: `480px` (max)

### Grid System
- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: 4-column grid
- Gutter: 24px desktop, 16px mobile

---

## Shadow System
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 16px rgba(168,41,78,0.08), 0 2px 4px rgba(0,0,0,0.04);
--shadow-lg: 0 8px 32px rgba(168,41,78,0.12), 0 4px 8px rgba(0,0,0,0.06);
--shadow-xl: 0 20px 48px rgba(168,41,78,0.15), 0 8px 16px rgba(0,0,0,0.08);
```

---

## Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Small elements, tags |
| `rounded-md` | 8px | Inputs, buttons |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Large cards, modals |
| `rounded-2xl` | 24px | Profile cards, hero sections |
| `rounded-full` | 9999px | Badges, avatars, pills |

---

## Component Catalog

### ProfileCard
- Avatar (rounded, 80px)
- Name + age + location
- Community badge
- Verification badges (row)
- Compatibility score (colored ring)
- Action buttons: Interest | Shortlist | More
- Hover: lift shadow + reveal contact CTA

### SearchResultCard (compact)
- Smaller avatar (56px)
- Name, age, education, location in one line
- Tags: religion, community
- Interest button
- Active indicator dot (green if online)

### VerificationBadge
- Phone ✓ | Email ✓ | ID ✓ | Photo ✓ | Premium ⭐
- Colors: green (verified), amber (pending), gray (not done)

### CompatibilityMeter
- Circular progress ring (0–100)
- Color: green >80, amber 60–79, rose <60
- 2–3 reason chips below

### StepWizard
- Step indicators at top (numbered dots with lines)
- Progress bar
- Current step title
- Back / Next / Skip buttons
- Auto-save indicator

### SkeletonCard
- Animated shimmer placeholders for all cards
- Matches ProfileCard dimensions

---

## Motion System
```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 }
}

// Card hover
const cardHover = {
  scale: 1.02,
  boxShadow: '0 20px 48px rgba(168,41,78,0.15)',
  transition: { duration: 0.2, ease: 'easeOut' }
}

// Interest button pulse
const interestPulse = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3, ease: 'backOut' }
}
```

---

## Iconography
- Library: **Lucide React** (clean, consistent stroke icons)
- Size standards: 16px (inline), 20px (buttons), 24px (nav), 32px (feature icons)
- Custom SVG: Tamil kolam pattern (decorative, header divider)
