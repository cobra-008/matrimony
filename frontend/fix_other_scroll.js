const fs = require('fs');

// Fix search/regular/page.tsx
let f1 = 'src/app/search/regular/page.tsx';
if (fs.existsSync(f1)) {
  let c1 = fs.readFileSync(f1, 'utf8');
  c1 = c1.replace(/const saved = sessionStorage\.getItem\("search_regular_scroll"\);\s*if \(saved\) \{[\s\S]*?\}\s*\}/g, `requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });`);
  c1 = c1.replace(/\s*sessionStorage\.setItem\("search_regular_scroll", String\(window\.scrollY\)\);/g, '');
  fs.writeFileSync(f1, c1);
  console.log('Fixed search/regular/page.tsx');
}

// Fix interests/page.tsx
let f2 = 'src/app/interests/page.tsx';
if (fs.existsSync(f2)) {
  let c2 = fs.readFileSync(f2, 'utf8');
  c2 = c2.replace(/const saved = sessionStorage\.getItem\("interests_sidebar_scroll"\);\s*if \(saved\) \{[\s\S]*?\}\s*\}/g, `requestAnimationFrame(() => {
        if (sidebarRef.current) sidebarRef.current.scrollTop = 0;
      });`);
  c2 = c2.replace(/\s*if \(sidebarRef\.current\) sessionStorage\.setItem\("interests_sidebar_scroll", String\(sidebarRef\.current\.scrollTop\)\);/g, '');
  fs.writeFileSync(f2, c2);
  console.log('Fixed interests/page.tsx');
}
