const fs = require('fs');

// Lire le fichier
const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
const lines = content.split('\n');

// Modifier uniquement la ligne 474 (index 474)
if (lines[474].includes("padding: '2rem 1rem'")) {
  lines[474] = lines[474].replace(
    "padding: '2rem 1rem'",
    "padding: '2rem 1rem', background: '#e0f2fe'"
  );
  
  // Écrire le fichier modifié
  fs.writeFileSync('app/(app)/relecture/page.tsx', lines.join('\n'));
  console.log('✅ Fond bleu #e0f2fe ajouté au module Relecture (ligne 475)');
} else {
  console.log('❌ Pattern non trouvé à la ligne 475');
}
