const fs = require('fs');
const path = require('path');

// Créer le fichier manquant
const dirs = [
  '.next/server/app/(app)',
  '.next/server/app'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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
