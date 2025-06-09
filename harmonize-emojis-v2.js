const fs = require('fs');

const content = fs.readFileSync('app/(app)/relecture/page.tsx', 'utf8');
let newContent = content;

// 1. Remplacer uniquement dans la config
newContent = newContent.replace(
  'grace: { icon: Sparkles, color:',
  'grace: { emoji: "✨", icon: Sparkles, color:'
);
newContent = newContent.replace(
  'priere: { icon: Heart, color:',
  'priere: { emoji: "🙏", icon: Heart, color:'
);
newContent = newContent.replace(
  'ecriture: { icon: BookOpen, color:',
  'ecriture: { emoji: "📖", icon: BookOpen, color:'
);
newContent = newContent.replace(
  'parole: { icon: MessageSquare, color:',
  'parole: { emoji: "🕊️", icon: MessageSquare, color:'
);
newContent = newContent.replace(
  'rencontre: { icon: Users, color:',
  'rencontre: { emoji: "🤝", icon: Users, color:'
);

// 2. Remplacer dans le return par défaut
newContent = newContent.replace(
  'return configs[type] || { icon: Sparkles,',
  'return configs[type] || { emoji: "✨", icon: Sparkles,'
);

fs.writeFileSync('app/(app)/relecture/page.tsx', newContent);
console.log('✅ Emojis ajoutés dans la config');
