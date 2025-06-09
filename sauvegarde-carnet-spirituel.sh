#!/bin/bash

# Script de sauvegarde complète du projet Carnet Spirituel
# Ce script crée une archive complète du projet avec tous les fichiers importants

echo "🔄 Début de la sauvegarde du projet Carnet Spirituel..."

# Configuration
PROJECT_DIR="/Users/admin/carnet-spirituel"
BACKUP_DIR="/Users/admin/Desktop"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="carnet-spirituel-backup-${DATE}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Vérifier que le projet existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Erreur : Le dossier du projet n'existe pas : $PROJECT_DIR"
    exit 1
fi

# Se déplacer dans le dossier du projet
cd "$PROJECT_DIR" || exit 1

echo "📁 Création du dossier de sauvegarde : $BACKUP_PATH"
mkdir -p "$BACKUP_PATH"

# Créer la structure de dossiers
echo "📂 Création de la structure des dossiers..."
mkdir -p "$BACKUP_PATH/app"
mkdir -p "$BACKUP_PATH/public"
mkdir -p "$BACKUP_PATH/documentation"

# Sauvegarder les fichiers de configuration racine
echo "📄 Sauvegarde des fichiers de configuration..."
cp -p package.json "$BACKUP_PATH/" 2>/dev/null
cp -p package-lock.json "$BACKUP_PATH/" 2>/dev/null
cp -p tsconfig.json "$BACKUP_PATH/" 2>/dev/null
cp -p next.config.js "$BACKUP_PATH/" 2>/dev/null
cp -p .env.local "$BACKUP_PATH/" 2>/dev/null || echo "⚠️  .env.local non trouvé (normal si non créé)"
cp -p tailwind.config.ts "$BACKUP_PATH/" 2>/dev/null
cp -p postcss.config.js "$BACKUP_PATH/" 2>/dev/null
cp -p README.md "$BACKUP_PATH/" 2>/dev/null
cp -p claude-helper.js "$BACKUP_PATH/" 2>/dev/null || echo "ℹ️  claude-helper.js non trouvé"
cp -p analyse-complete.sh "$BACKUP_PATH/" 2>/dev/null || echo "ℹ️  analyse-complete.sh non trouvé"

# Sauvegarder le dossier app complet
echo "📱 Sauvegarde du dossier app..."
cp -rp app/* "$BACKUP_PATH/app/" 2>/dev/null

# Sauvegarder le dossier public
echo "🖼️  Sauvegarde du dossier public..."
cp -rp public/* "$BACKUP_PATH/public/" 2>/dev/null || echo "ℹ️  Dossier public vide ou non trouvé"

# Créer un fichier de documentation avec l'état du projet
echo "📝 Création du fichier d'état du projet..."
cat > "$BACKUP_PATH/documentation/ETAT_DU_PROJET.md" << 'EOFSTATE'
# 📊 État du projet Carnet Spirituel

## Date de sauvegarde
$(date)

## ✅ Modules terminés
- Authentification (login/register/logout)
- Dashboard avec nouveau design harmonisé
- Module Grâces (CRUD complet + tags)
- Module Prières (CRUD + système de suivi unique)
- Module Écritures (CRUD complet)
- Module Paroles de connaissance (CRUD + accomplissement)
- Module Rencontres (CRUD complet)
- Module Relecture spirituelle (Timeline + suggestions intelligentes + vue constellation)

## 🎨 Design harmonisé
- Migration complète vers CSS pur (abandon de Tailwind)
- Palette liturgique cohérente
- Menu latéral avec cercles et emojis
- Animations douces et transitions fluides
- Mobile-first responsive

## 🔧 Stack technique
- Frontend : Next.js 14 (App Router) + TypeScript
- Base de données & Auth : Supabase
- Styles : CSS pur
- Icônes : Lucide React
- Dates : date-fns avec locale française

## 📁 Structure des modules
Chaque module suit cette structure :
- page.tsx : Liste des éléments
- nouvelle/page.tsx : Ajout d'un nouvel élément
- [id]/page.tsx : Détail d'un élément
- [id]/modifier/page.tsx : Modification d'un élément

## ⚠️ Points d'attention
- Toujours utiliser EOF (pas ENDOFFILE) pour les heredocs
- Mettre les chemins avec parenthèses entre guillemets
- L'icône Pray n'existe pas dans Lucide, utiliser HandHeart
- Vérifier les noms de colonnes dans Supabase avant insertion
- Params Next.js 15 : utiliser use(params)

## 🚀 Prochaines étapes
- Système de liens spirituels enrichis
- Export PDF du carnet
- Mode hors-ligne
- Intégration API AELF
- Système de partage modéré
EOFSTATE

# Créer une liste des fichiers importants
echo "📋 Création de la liste des fichiers..."
find "$BACKUP_PATH" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css" -o -name "*.json" | sort > "$BACKUP_PATH/documentation/LISTE_FICHIERS.txt"

# Compter les fichiers
TOTAL_FILES=$(find "$BACKUP_PATH" -type f | wc -l | tr -d ' ')
echo "📊 Total de fichiers sauvegardés : $TOTAL_FILES"

# Créer l'archive tar.gz
echo "🗜️  Création de l'archive compressée..."
cd "$BACKUP_DIR" || exit 1
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"

# Vérifier la taille de l'archive
ARCHIVE_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo "💾 Taille de l'archive : $ARCHIVE_SIZE"

# Optionnel : supprimer le dossier non compressé
read -p "Voulez-vous supprimer le dossier non compressé ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BACKUP_PATH"
    echo "🗑️  Dossier non compressé supprimé"
fi

echo "✅ Sauvegarde terminée !"
echo "📦 Archive créée : ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo ""
echo "Pour restaurer le projet :"
echo "tar -xzf ${BACKUP_NAME}.tar.gz"
echo "cd ${BACKUP_NAME}"
echo "npm install"

# Créer aussi un script de restauration
cat > "${BACKUP_DIR}/restaurer-carnet-spirituel.sh" << 'EOFRESTORE'
#!/bin/bash
# Script de restauration du projet Carnet Spirituel

if [ -z "$1" ]; then
    echo "Usage: ./restaurer-carnet-spirituel.sh <archive.tar.gz>"
    exit 1
fi

ARCHIVE="$1"
RESTORE_DIR="/Users/admin/carnet-spirituel-restored"

echo "🔄 Restauration du projet depuis $ARCHIVE..."

# Extraire l'archive
tar -xzf "$ARCHIVE" -C /tmp/

# Trouver le dossier extrait
EXTRACTED_DIR=$(tar -tzf "$ARCHIVE" | head -1 | cut -d'/' -f1)

# Déplacer vers le dossier de destination
mv "/tmp/$EXTRACTED_DIR" "$RESTORE_DIR"

cd "$RESTORE_DIR" || exit 1

echo "📦 Installation des dépendances..."
npm install

echo "✅ Restauration terminée !"
echo "📁 Projet restauré dans : $RESTORE_DIR"
echo ""
echo "Pour démarrer le projet :"
echo "cd $RESTORE_DIR"
echo "npm run dev"
EOFRESTORE

chmod +x "${BACKUP_DIR}/restaurer-carnet-spirituel.sh"

echo "📝 Script de restauration créé : ${BACKUP_DIR}/restaurer-carnet-spirituel.sh"
