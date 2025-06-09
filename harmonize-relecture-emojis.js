const fs = require('fs');

const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
let newContent = content;

// 1. Remplacer la fonction getTypeConfig pour utiliser emoji au lieu de icon
newContent = newContent.replace(
  /grace: { icon: Sparkles,/g,
  "grace: { emoji: '✨',"
);
newContent = newContent.replace(
  /priere: { icon: Heart,/g,
  "priere: { emoji: '🙏',"
);
newContent = newContent.replace(
  /ecriture: { icon: BookOpen,/g,
  "ecriture: { emoji: '📖',"
);
newContent = newContent.replace(
  /parole: { icon: MessageSquare,/g,
  "parole: { emoji: '🕊️',"
);
newContent = newContent.replace(
  /rencontre: { icon: Users,/g,
  "rencontre: { emoji: '🤝',"
);

// 2. Remplacer icon par emoji dans le return
newContent = newContent.replace(
  /return configs\[type\] \|\| { icon: Sparkles,/g,
  "return configs[type] || { emoji: '✨',"
);

// 3. Remplacer toutes les utilisations de config.icon
newContent = newContent.replace(/const Icon = config\.icon/g, '// Icon remplacé par emoji');
newContent = newContent.replace(/config\.icon/g, 'config.emoji');

// 4. Remplacer les composants <Icon> par des spans avec emoji
newContent = newContent.replace(/<Icon size={(\d+)}/g, '<span style={{fontSize: "$1px"}}>{config.emoji}</span');
newContent = newContent.replace(/<Icon /g, '<span>{config.emoji}</span><span ');

// 5. Nettoyer les imports inutiles
const importLines = newContent.split('\n');
const newImportLines = importLines.filter(line => {
  return !line.includes('Sparkles') && 
         !line.includes('Heart') && 
         !line.includes('BookOpen') && 
         !line.includes('MessageSquare') && 
         !line.includes('Users from \'lucide-react\'');
});
newContent = newImportLines.join('\n');

fs.writeFileSync('app/(app)/relecture/page.tsx', newContent);
console.log('✅ Emojis harmonisés dans le module Relecture');
