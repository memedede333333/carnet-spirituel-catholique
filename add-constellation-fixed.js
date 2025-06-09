const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/(app)/relecture/page.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Vérifier si constellation est déjà dans viewMode
  if (!content.includes("'constellation'")) {
    content = content.replace(
      "useState<'chronologique' | 'thematique' | 'consolations' | 'jardin' | 'fleuve'>('chronologique')",
      "useState<'chronologique' | 'thematique' | 'consolations' | 'jardin' | 'fleuve' | 'constellation'>('chronologique')"
    );
  }
  
  // 2. Ajouter l'état pour les liens spirituels si pas déjà présent
  if (!content.includes('const [spiritualLinks, setSpiritualLinks]')) {
    const stateSection = content.indexOf('const [firstSelectedEntry, setFirstSelectedEntry]');
    if (stateSection > -1) {
      const endOfLine = content.indexOf('\n', stateSection);
      content = content.slice(0, endOfLine + 1) + 
        '  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])\n' +
        content.slice(endOfLine + 1);
    }
  }
  
  // 3. Ajouter le chargement des liens si pas déjà présent
  if (!content.includes('setSpiritualLinks(')) {
    const loadLinksCode = `
      // Charger les liens spirituels
      const { data: liensData } = await supabase
        .from('liens_spirituels')
        .select('*')
        .eq('user_id', user.id)
      
      setSpiritualLinks(liensData || [])`;
    
    const insertPoint = content.indexOf('setEntries(allEntries)');
    if (insertPoint > -1) {
      const nextLine = content.indexOf('\n', insertPoint);
      content = content.slice(0, nextLine + 1) + loadLinksCode + content.slice(nextLine + 1);
    }
  }
  
  // 4. Ajouter le bouton constellation si pas déjà présent
  if (!content.includes('Constellation</button>')) {
    const constellationButton = `
          <button
            onClick={() => setViewMode('constellation')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: viewMode === 'constellation' ? '#7c3aed' : 'transparent',
              color: viewMode === 'constellation' ? 'white' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Star size={16} />
            Constellation
          </button>`;
    
    const fleuveButtonIndex = content.indexOf('Fleuve de vie');
    if (fleuveButtonIndex > -1) {
      const buttonEndIndex = content.indexOf('</button>', fleuveButtonIndex) + 9;
      content = content.slice(0, buttonEndIndex) + constellationButton + content.slice(buttonEndIndex);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Vue constellation préparée');
}
