const fs = require('fs');

const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
let newContent = content;

// Remplacer Heart par ❤️ pour Consolations & désolations
newContent = newContent.replace(
  '<Heart size={16} />',
  '<span style={{fontSize: "16px"}}>❤️</span>'
);

// Remplacer Heart size={24} par ❤️
newContent = newContent.replace(
  '<Heart size={24} />',
  '<span style={{fontSize: "24px"}}>❤️</span>'
);

// Remplacer Church par 🕊️ (ou ⛪ si vous préférez)
newContent = newContent.replace(
  '<Church size={20} />',
  '<span style={{fontSize: "20px"}}>🕊️</span>'
);

fs.writeFileSync('app/(app)/relecture/page.tsx', newContent);
console.log('✅ Icônes restantes remplacées');
