const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');
const backupPath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx.backup');

console.log('=== AUDIT DU FICHIER ===');

if (fs.existsSync(filePath)) {
  // Faire un backup
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(backupPath, content);
  console.log('✓ Backup créé:', backupPath);
  
  // Analyser les doublons
  const lines = content.split('\n');
  console.log(`Nombre total de lignes: ${lines.length}`);
  
  // Détecter les doublons
  const duplicates = {
    hoveredEntry: [],
    areEntriesLinked: [],
    spiritualLinks: []
  };
  
  lines.forEach((line, index) => {
    if (line.includes('const [hoveredEntry, setHoveredEntry]')) {
      duplicates.hoveredEntry.push(index + 1);
    }
    if (line.includes('const areEntriesLinked')) {
      duplicates.areEntriesLinked.push(index + 1);
    }
    if (line.includes('const [spiritualLinks, setSpiritualLinks]')) {
      duplicates.spiritualLinks.push(index + 1);
    }
  });
  
  console.log('\n=== DOUBLONS DÉTECTÉS ===');
  console.log('hoveredEntry déclaré aux lignes:', duplicates.hoveredEntry);
  console.log('areEntriesLinked déclaré aux lignes:', duplicates.areEntriesLinked);
  console.log('spiritualLinks déclaré aux lignes:', duplicates.spiritualLinks);
  
  // Nettoyer les doublons
  const seenDeclarations = new Set();
  const cleanedLines = [];
  let skipNextLines = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (skipNextLines > 0) {
      skipNextLines--;
      continue;
    }
    
    const line = lines[i];
    
    // Vérifier les déclarations
    if (line.includes('const [hoveredEntry, setHoveredEntry]')) {
      if (seenDeclarations.has('hoveredEntry')) {
        console.log(`✗ Suppression du doublon hoveredEntry ligne ${i + 1}`);
        continue;
      }
      seenDeclarations.add('hoveredEntry');
    }
    
    if (line.includes('const areEntriesLinked')) {
      if (seenDeclarations.has('areEntriesLinked')) {
        // Supprimer la fonction entière (jusqu'à la fermeture)
        console.log(`✗ Suppression du doublon areEntriesLinked ligne ${i + 1}`);
        let j = i;
        let braceCount = 0;
        let foundStart = false;
        while (j < lines.length) {
          if (lines[j].includes('{')) {
            foundStart = true;
            braceCount++;
          }
          if (foundStart && lines[j].includes('}')) {
            braceCount--;
            if (braceCount === 0) {
              skipNextLines = j - i;
              break;
            }
          }
          j++;
        }
        continue;
      }
      seenDeclarations.add('areEntriesLinked');
    }
    
    if (line.includes('const [spiritualLinks, setSpiritualLinks]')) {
      if (seenDeclarations.has('spiritualLinks')) {
        console.log(`✗ Suppression du doublon spiritualLinks ligne ${i + 1}`);
        continue;
      }
      seenDeclarations.add('spiritualLinks');
    }
    
    cleanedLines.push(line);
  }
  
  // Écrire le fichier nettoyé
  const cleanedContent = cleanedLines.join('\n');
  fs.writeFileSync(filePath, cleanedContent);
  
  console.log('\n=== RÉSULTAT ===');
  console.log(`Lignes originales: ${lines.length}`);
  console.log(`Lignes après nettoyage: ${cleanedLines.length}`);
  console.log(`Lignes supprimées: ${lines.length - cleanedLines.length}`);
  console.log('\n✓ Fichier nettoyé avec succès');
  
  // Vérification finale
  const finalContent = fs.readFileSync(filePath, 'utf8');
  const finalLines = finalContent.split('\n');
  
  console.log('\n=== VÉRIFICATION FINALE ===');
  ['hoveredEntry', 'areEntriesLinked', 'spiritualLinks'].forEach(declaration => {
    const count = finalLines.filter(line => line.includes(`const ${declaration}`) || line.includes(`const [${declaration}`)).length;
    console.log(`${declaration}: ${count} déclaration(s)`);
  });
  
} else {
  console.error('Fichier non trouvé:', filePath);
}
