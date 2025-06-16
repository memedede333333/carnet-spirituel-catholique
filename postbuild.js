const fs = require('fs');
const path = require('path');

// Créer les dossiers que Vercel cherche
const dirs = [
  '.next/server/app/(app)',
  '.next/server/app/(auth)',
  '.next/server/app'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Créer le fichier problématique
const files = [
  '.next/server/app/(app)/page_client-reference-manifest.js',
  '.next/server/app/(app)/page.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '{}');
  }
});

console.log('✅ Vercel build fix applied');
