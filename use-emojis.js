const fs = require('fs');

const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
let newContent = content;

// Remplacer les lignes où on utilise Icon par l'emoji
// D'abord, on cherche et remplace les patterns <Icon size={...}
newContent = newContent.replace(
  /<Icon size={(\d+)} style={{([^}]+)}} \/>/g,
  '<span style={{fontSize: "$1px", $2}}>{config.emoji || "✨"}</span>'
);

// Remplacer les <Icon size={...} /> sans style
newContent = newContent.replace(
  /<Icon size={(\d+)} \/>/g,
  '<span style={{fontSize: "$1px"}}>{config.emoji || "✨"}</span>'
);

// Remplacer les <Icon /> simples
newContent = newContent.replace(
  /<Icon \/>/g,
  '<span>{config.emoji || "✨"}</span>'
);

fs.writeFileSync('app/(app)/relecture/page.tsx', newContent);
console.log('✅ Utilisation des emojis activée');
