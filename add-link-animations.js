const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter une fonction pour vérifier si deux entrées sont liées
  const checkLinkedFunction = `
  const areEntriesLinked = (entry1: any, entry2: any) => {
    return spiritualLinks.some(link => 
      (link.element_source_id === entry1.id && link.element_source_type === entry1.type &&
       link.element_cible_id === entry2.id && link.element_cible_type === entry2.type) ||
      (link.element_source_id === entry2.id && link.element_source_type === entry2.type &&
       link.element_cible_id === entry1.id && link.element_cible_type === entry1.type)
    )
  }
`;

  // Insérer après la fonction getEntryText
  const getEntryTextIndex = content.indexOf('const getEntryText = (entry: any)');
  if (getEntryTextIndex > -1) {
    const nextFunctionIndex = content.indexOf('\n\n', getEntryTextIndex);
    content = content.slice(0, nextFunctionIndex) + '\n' + checkLinkedFunction + content.slice(nextFunctionIndex);
  }
  
  // Modifier les cartes pour qu'elles brillent si elles sont liées à l'élément survolé
  // Ajouter un état pour l'élément survolé
  const hoveredStateIndex = content.indexOf('const [firstSelectedEntry, setFirstSelectedEntry]');
  if (hoveredStateIndex > -1) {
    const endOfLine = content.indexOf('\n', hoveredStateIndex);
    content = content.slice(0, endOfLine + 1) + 
      '  const [hoveredEntry, setHoveredEntry] = useState<any>(null)\n' +
      content.slice(endOfLine + 1);
  }
  
  // Ajouter les animations CSS à la fin
  const animationStyles = `
      <style jsx global>{\`
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
          50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.6); }
          100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
        }
        
        .linked-card {
          animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      \`}</style>`;
  
  // Remplacer la balise style existante
  const styleIndex = content.indexOf('<style jsx>{`');
  if (styleIndex > -1) {
    const styleEndIndex = content.indexOf('`}</style>', styleIndex) + 10;
    content = content.slice(0, styleIndex) + animationStyles + content.slice(styleEndIndex);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Animations de liens ajoutées');
}
