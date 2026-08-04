# 11 — Testing Checklist

## Frontend Tests

### Homepage
- [ ] Hero section renders correctly
- [ ] Search widget is functional
- [ ] Success stories carousel works
- [ ] CTA buttons navigate correctly
- [ ] Footer links are correct
- [ ] Mobile responsive at 375px, 768px, 1280px

### Registration Wizard
- [ ] All 8 steps render
- [ ] Progress bar advances correctly
- [ ] Back button goes to previous step
- [ ] Form validation shows errors
- [ ] Religion → Community cascade filter works
- [ ] State → City cascade works
- [ ] OTP input accepts 6 digits
- [ ] Photo upload preview works
- [ ] T&C consent required before submit
- [ ] Autosave between steps (localStorage)

### Profile Detail
- [ ] Photos display correctly
- [ ] Compatibility score renders
- [ ] Match reasons display
- [ ] Action buttons (Interest, Shortlist) work
- [ ] Blurred contact for free users
- [ ] Verification badges display

### Search
- [ ] Filters apply correctly
- [ ] Results paginate
- [ ] Empty state shows when no results
- [ ] Sort options work
- [ ] Skeleton loads during fetch

### Chat
- [ ] Thread list renders
- [ ] Messages display in order
- [ ] Send message works
- [ ] Read receipts update

### Membership
- [ ] Plan comparison table renders
- [ ] CTA for each plan works
- [ ] Current plan highlighted

### Admin
- [ ] Dashboard metrics display
- [ ] Profile review queue loads
- [ ] Approve/reject actions work
- [ ] Audit log renders

## Accessibility
- [ ] All interactive elements keyboard navigable
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Headings follow hierarchy (h1 → h2 → h3)
- [ ] Focus indicators visible

## Performance
- [ ] Lighthouse score > 90 on homepage
- [ ] First Contentful Paint < 1.5s
- [ ] Images optimized with next/image
- [ ] Fonts load with font-display: swap

## SEO
- [ ] Each page has unique title tag
- [ ] Meta descriptions on all pages
- [ ] OG tags for social sharing
- [ ] Canonical URLs set
- [ ] Sitemap.xml generated
- [ ] robots.txt present
