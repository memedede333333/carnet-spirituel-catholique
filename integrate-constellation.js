const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Ajouter l'import si pas déjà présent
  if (!content.includes('import ConstellationView')) {
    const importsEnd = content.indexOf('export default function RelecturePage()');
    content = content.slice(0, importsEnd) + 
      "import ConstellationView from '@/app/components/ConstellationView'\n\n" +
      content.slice(importsEnd);
  }
  
  // 2. Ajouter la vue constellation avant le message d'encouragement
  if (!content.includes("viewMode === 'constellation'")) {
    const constellationSection = `
        {/* Vue Constellation */}
        {viewMode === 'constellation' && (
          <ConstellationView 
            entries={filteredEntries}
            links={spiritualLinks}
            onEntryClick={handleLinkClick}
            getTypeConfig={getTypeConfig}
          />
        )}

        `;
    
    const insertPoint = content.indexOf('{/* Message d\'encouragement si vide */}');
    if (insertPoint > -1) {
      content = content.slice(0, insertPoint) + constellationSection + content.slice(insertPoint);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log('ConstellationView intégré');
}
