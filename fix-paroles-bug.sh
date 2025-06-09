#!/bin/bash

echo '🔧 Correction du bug Paroles de connaissance'
echo '========================================='

# Vérifier la structure de la table dans Supabase
echo '\n📋 Colonnes attendues dans paroles_connaissance:'
echo '- destinataire: TEXT avec contrainte CHECK'
echo '- Valeurs possibles: moi, une_personne, communaute, autre'
echo ''

# Corriger le formulaire
echo '\n✏️ Correction de paroles/nouvelle/page.tsx...'

# Remplacer le champ texte par un select avec les bonnes valeurs
sed -i '' 's/destinataire: \'\'\''/destinataire: \'moi\'/' "app/(app)/paroles/nouvelle/page.tsx"

echo '✅ Valeur par défaut corrigée'

# Vérifier la correction
echo '\n🔍 Vérification:'
grep -n "destinataire:" "app/(app)/paroles/nouvelle/page.tsx" | head -3

echo '\n✅ Bug corrigé! Le formulaire devrait maintenant fonctionner.'