const fs = require('fs');
let file = 'src/app/matches/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Scroll right panel to top when navigating back from a profile or switching sections[\s\S]*?\}, \[loading, activeSection\]\);/g;

const replacement = `// Scroll right panel to top when navigating back from a profile or switching sections
  useEffect(() => {
    if (loading) return; // wait until profiles have loaded and rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (rightPanelRef.current) {
          rightPanelRef.current.scrollTop = 0;
        }
      });
    });
  }, [loading, activeSection]);`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed matches/page.tsx successfully.');
} else {
  console.log('Could not match regex.');
}
