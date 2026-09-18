const fs = require('fs');
const files = [
  'src/app/matches/page.tsx',
  'src/app/profile/[id]/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/search/page.tsx',
  'src/app/page.tsx',
  'src/app/faq/page.tsx',
  'src/components/ui/ScrollToTop.tsx'
];

const replacement = `    if (typeof window !== "undefined") {
      const resetScroll = () => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const vp = document.getElementById("app-scroll-viewport");
        if (vp) vp.scrollTop = 0;
      };
      resetScroll();
      const t1 = setTimeout(resetScroll, 10);
      const t2 = setTimeout(resetScroll, 50);
      const t3 = setTimeout(() => { document.documentElement.style.scrollBehavior = ""; }, 100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }`;

const regex = /if \(typeof window !== "undefined"\) \{[\s\S]*?return \(\) => \{ clearTimeout\(t1\); clearTimeout\(t2\); clearTimeout\(t3\); \};\n\s*\}/g;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } else {
    console.log('Not found in', file);
  }
});
