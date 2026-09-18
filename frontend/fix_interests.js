const fs = require('fs');
let file = 'src/app/interests/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const saved = sessionStorage\.getItem\("interests_sidebar_scroll"\);[\s\S]*?\}\s*\}\s*\}, \[loading, activeSection\]\);/g, 
`requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (sidebarRef.current) sidebarRef.current.scrollTop = 0;
      });
    });
  }, [loading, activeSection]);`);

fs.writeFileSync(file, content);
