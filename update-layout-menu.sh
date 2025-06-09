#!/bin/bash

echo '🔧 Ajout du lien Relecture dans le menu latéral'

# Chercher la ligne avec 'rencontres' et ajouter après
sed -i '' '/\/rencontres/a\
        <Link href="/relecture" className={`nav-link ${pathname === "/relecture" ? "active" : ""}`}>\
          <span className="nav-icon">🌿</span>\
          <span className="nav-text">Relecture</span>\
        </Link>' "app/(app)/layout.tsx"

echo '✅ Menu mis à jour!'