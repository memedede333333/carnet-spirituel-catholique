const fs = require('fs');

// Lire le fichier
const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
const lines = content.split('\n');

// Chercher le premier div avec minHeight: '100vh' après le return
let found = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("minHeight: '100vh'") && lines[i].includes('style={{')) {
    // Ajouter background après minHeight
    lines[i] = lines[i].replace(
      "minHeight: '100vh',",
      "minHeight: '100vh', background: '#e0f2fe',"
    );
    found = true;
    console.log(`✅ Fond bleu ajouté à la ligne ${i + 1}`);
    break;
  }
}

if (found) {
  fs.writeFileSync('app/(app)/relecture/page.tsx', lines.join('\n'));
  console.log('✅ Fond bleu #e0f2fe ajouté au fond de la page Relecture');
} else {
  console.log('❌ Pattern non trouvé');
}
