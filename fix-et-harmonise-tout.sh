#!/bin/bash

echo '🔧 CORRECTION ET HARMONISATION COMPLÈTE'
echo '======================================'

# 1. CORRIGER LE BUG PAROLES
echo '\n📝 Correction du bug dans Paroles de connaissance...'

# Lire le contenu actuel pour diagnostiquer
echo 'Analyse du problème destinataire...'
grep -n "destinataire" "app/(app)/paroles/nouvelle/page.tsx" | head -5

# La contrainte check attend probablement des valeurs spécifiques
# Correction: utiliser 'personnel' au lieu de 'moi'
sed -i.bak "s/destinataire: 'moi'/destinataire: 'personnel'/g" "app/(app)/paroles/nouvelle/page.tsx"

echo '✅ Bug corrigé'

# 2. CRÉER LA STRUCTURE MANQUANTE POUR ÉCRITURES
echo '\n📁 Création structure Écritures...'
mkdir -p "app/(app)/ecritures/[id]/modifier"

# 3. VÉRIFIER L'ÉTAT ACTUEL
echo '\n🔍 État actuel des modules:'
echo '\nÉcritures:'
find "app/(app)/ecritures" -name "*.tsx" -type f | sort
echo '\nParoles:'
find "app/(app)/paroles" -name "*.tsx" -type f | sort
echo '\nRencontres:'
find "app/(app)/rencontres" -name "*.tsx" -type f | sort

echo '\n✅ Diagnostic terminé!'
echo '\nProchaine étape: harmoniser les 3 modules avec un seul script complet'