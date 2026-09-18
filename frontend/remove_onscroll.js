const fs = require('fs');
let file = 'src/app/matches/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\s*onScroll=\{\(e\) => sessionStorage\.setItem\(`matches_scroll_\$\{activeSection\}`,\s*String\(e\.currentTarget\.scrollTop\)\)\}/g;

if (content.match(regex)) {
  content = content.replace(regex, '');
  fs.writeFileSync(file, content);
  console.log('Removed onScroll from matches/page.tsx successfully.');
} else {
  console.log('Could not match onScroll regex.');
}
