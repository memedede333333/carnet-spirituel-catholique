const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Chercher où insérer la vue constellation (après la vue fleuve)
const fleuveEnd = content.lastIndexOf('{viewMode === \'fleuve\'');
if (fleuveEnd > -1) {
  // Trouver la fin de cette section
  let braceCount = 0;
  let i = fleuveEnd;
  let foundStart = false;
  
  while (i < content.length) {
    if (content[i] === '{') {
      foundStart = true;
      braceCount++;
    } else if (content[i] === '}' && foundStart) {
      braceCount--;
      if (braceCount === 0) {
        // Insérer après cette section
        const beforeInsert = content.substring(0, i + 1);
        const afterInsert = content.substring(i + 1);
        
        const constellationView = `

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
        
        content = beforeInsert + constellationView + afterInsert;
        fs.writeFileSync(filePath, content);
        console.log('Vue constellation ajoutée avec succès');
        break;
      }
    }
    i++;
  }
}
