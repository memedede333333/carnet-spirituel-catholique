const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Chercher la div avec l'icône dans la vue chronologique
  // On cherche après "// Carte" et avant le prochain commentaire
  const carteIndex = content.indexOf('// Carte');
  if (carteIndex > -1) {
    // Trouver la div avec flexShrink: 0
    const searchStart = carteIndex;
    const searchEnd = content.indexOf('// Entrées', searchStart + 100) || content.length;
    const section = content.substring(searchStart, searchEnd);
    
    // Trouver l'endroit où insérer le badge
    const iconMatch = section.match(/<Icon size={20} \/>/);
    if (iconMatch) {
      const relativeIndex = iconMatch.index + iconMatch[0].length;
      const absoluteIndex = searchStart + relativeIndex;
      
      // Vérifier si le badge n'est pas déjà là
      if (!content.substring(absoluteIndex, absoluteIndex + 100).includes('linksCount')) {
        const badge = `
                        {entry.linksCount > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '-0.25rem',
                            right: '-0.25rem',
                            background: '#a855f7',
                            color: 'white',
                            borderRadius: '9999px',
                            width: '1.25rem',
                            height: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }}>
                            {entry.linksCount}
                          </div>
                        )}`;
        
        content = content.slice(0, absoluteIndex) + badge + content.slice(absoluteIndex);
        
        // Rendre la div parente relative
        content = content.replace(
          /flexShrink: 0\s*}/,
          'flexShrink: 0,\n                        position: \'relative\'\n                      }'
        );
        
        fs.writeFileSync(filePath, content);
        console.log('Badge de liens ajouté avec succès');
      } else {
        console.log('Le badge existe déjà');
      }
    }
  }
}
