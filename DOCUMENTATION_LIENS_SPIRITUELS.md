# Documentation complète du système de liens spirituels

## Vue d'ensemble

Le système de liens spirituels est un module central du Carnet Spirituel qui permet de créer et visualiser des connexions entre différents éléments spirituels (grâces, prières, écritures, paroles, rencontres). Il offre une approche holistique pour comprendre les liens entre les expériences spirituelles d'un utilisateur.

## Architecture du système

### 1. Modèles de données

#### Table `liens_spirituels`
La table principale stocke les relations entre éléments :

```sql
liens_spirituels {
  id: string (UUID)
  user_id: string (référence utilisateur)
  element_source_type: string (type de l'élément source)
  element_source_id: string (ID de l'élément source)
  element_cible_type: string (type de l'élément cible)
  element_cible_id: string (ID de l'élément cible)
  type_lien: string (type de relation)
  description: string (description du lien)
  created_at: timestamp
}
```

#### Interface TypeScript `SpiritualLink`
```typescript
interface SpiritualLink {
  id: string
  user_id: string
  element_source_type: string
  element_source_id: string
  element_cible_type: string
  element_cible_id: string
  type_lien: string
  description: string
  created_at: string
}
```

#### Interface `Entry`
Structure unifiée pour tous les éléments spirituels :
```typescript
interface Entry {
  id: string
  type: 'grace' | 'priere' | 'ecriture' | 'parole' | 'rencontre'
  date?: string
  created_at?: string
  texte?: string
  sujet?: string
  reference?: string
  personne_prenom?: string
  personne_nom?: string
  [key: string]: any
}
```

### 2. Types de liens spirituels

Le système reconnaît 5 types de connexions spirituelles :

| Type | Emoji | Description | Usage |
|------|-------|-------------|-------|
| `exauce` | 🙏 | Exaucement | Une prière exaucée par une grâce |
| `accomplit` | ✓ | Accomplissement | Une parole accomplie par un événement |
| `decoule` | → | Découlement | Un élément découle d'un autre |
| `eclaire` | 💡 | Éclairage | Un élément éclaire un autre |
| `echo` | 🔄 | Écho | Deux éléments font écho l'un à l'autre |

### 3. Configuration des types d'éléments

Chaque type d'élément spirituel a sa configuration visuelle :

```typescript
const typeConfigs = {
  grace: { 
    emoji: "✨", 
    color: '#fbbf24', 
    gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', 
    label: 'Grâce' 
  },
  priere: { 
    emoji: "🙏", 
    color: '#6366f1', 
    gradient: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', 
    label: 'Prière' 
  },
  ecriture: { 
    emoji: "📖", 
    color: '#10b981', 
    gradient: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', 
    label: 'Écriture' 
  },
  parole: { 
    emoji: "🕊️", 
    color: '#0ea5e9', 
    gradient: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)', 
    label: 'Parole' 
  },
  rencontre: { 
    emoji: "🤝", 
    color: '#f43f5e', 
    gradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)', 
    label: 'Rencontre' 
  }
}
```

## Services et logique métier

### 1. Helpers principaux (`app/lib/spiritual-links-helpers.ts`)

#### `getLinksCountForEntry(entryId: string, links: SpiritualLink[]): number`
Retourne le nombre total de liens pour une entrée donnée.

#### `getLinksForEntry(entryId: string, entryType: string, links: SpiritualLink[]): SpiritualLink[]`
Retourne tous les liens d'une entrée spécifique.

#### `areEntriesLinked(entry1Id: string, entry2Id: string, links: SpiritualLink[]): boolean`
Vérifie si deux entrées sont connectées.

#### `getLinkTypeBetween(entry1Id: string, entry2Id: string, links: SpiritualLink[]): string | null`
Retourne le type de lien entre deux entrées.

#### `formatLinkDisplay(link: SpiritualLink, entries: Entry[])`
Formate l'affichage d'un lien avec textes source/cible et type.

#### `getEntryShortText(entry: Entry | undefined): string`
Génère un texte court représentatif pour une entrée.

#### `loadUserSpiritualLinks(userId: string): Promise<SpiritualLink[]>`
Charge tous les liens spirituels d'un utilisateur depuis la base de données.

#### `getTypeConfig(type: string)`
Retourne la configuration (emoji, couleur, gradient) pour un type donné.

### 2. Opérations base de données

#### Création d'un lien
```typescript
const { data, error } = await supabase
  .from('liens_spirituels')
  .insert({
    user_id: userId,
    element_source_type: sourceType,
    element_source_id: sourceId,
    element_cible_type: targetType,
    element_cible_id: targetId,
    type_lien: linkType,
    description: description
  })
```

#### Suppression d'un lien
```typescript
const { error } = await supabase
  .from('liens_spirituels')
  .delete()
  .eq('id', linkId)
```

#### Récupération des liens
```typescript
const { data, error } = await supabase
  .from('liens_spirituels')
  .select('*')
  .eq('user_id', userId)
  .or(`element_source_id.eq.${entryId},element_cible_id.eq.${entryId}`)
```

## Composants d'interface utilisateur

### 1. `SpiritualLinksSection` (`app/components/SpiritualLinksSection.tsx`)

**Responsabilité** : Afficher la section des liens spirituels sur une page d'élément.

**Props** :
- `entryId: string` - ID de l'entrée courante
- `entryType: string` - Type de l'entrée courante

**Fonctionnalités** :
- Affichage des liens existants
- Possibilité de supprimer un lien
- Liens vers les éléments connectés
- État de chargement et état vide

### 2. `LinksManager` (`app/components/LinksManager.tsx`)

**Responsabilité** : Modal de gestion des liens pour une entrée spécifique.

**Props** :
- `entryId: string` - ID de l'entrée
- `entryType: string` - Type de l'entrée
- `onClose: () => void` - Callback de fermeture

**Fonctionnalités** :
- Affichage en modal
- Liste des liens existants
- Suppression de liens
- Interface épurée pour la gestion

### 3. `LinkBadge` (`app/components/LinkBadge.tsx`)

**Responsabilité** : Badge affichant le nombre de liens d'un élément.

**Props** :
- `count: number` - Nombre de liens
- `color?: string` - Couleur du badge
- `size?: 'small' | 'medium' | 'large'` - Taille du badge
- `onClick?: () => void` - Callback au clic

**Fonctionnalités** :
- Affichage conditionnel (masqué si count = 0)
- Trois tailles disponibles
- Interactions hover
- Positionnement absolu

### 4. `LinksList` (`app/components/LinksList.tsx`)

**Responsabilité** : Liste réutilisable des liens avec actions.

**Props** :
- `entryId: string` - ID de l'entrée de référence
- `links: SpiritualLink[]` - Liste des liens
- `entries: Entry[]` - Liste de toutes les entrées
- `onViewEntry?: (entryId: string) => void` - Callback de visualisation
- `onDeleteLink?: (linkId: string) => void` - Callback de suppression
- `showActions?: boolean` - Afficher les boutons d'action
- `maxItems?: number` - Limiter le nombre d'items affichés

**Fonctionnalités** :
- Affichage directionnel des liens (source → cible)
- Actions de visualisation et suppression
- Limitation d'affichage avec compteur
- Interactions hover avec couleurs typées

### 5. `ConstellationView` (`app/components/ConstellationView.tsx`)

**Responsabilité** : Visualisation en constellation des éléments et leurs connexions.

**Props** :
- `entries: any[]` - Liste des entrées
- `links: any[]` - Liste des liens
- `onEntryClick: (entry: any) => void` - Callback au clic sur un élément
- `getTypeConfig: (type: string) => any` - Fonction de configuration des types

**Fonctionnalités principales** :
- **Disposition circulaire** : Les éléments sont disposés en cercle
- **Connexions visuelles** : Liens courbes entre les éléments connectés
- **Interactions** : Hover et clic sur les éléments
- **Tooltips dynamiques** : Informations au survol
- **Légende interactive** : Explication des types et liens
- **Responsive** : Adaptation à la taille du conteneur

**Éléments visuels** :
- Cercles colorés par type d'élément
- Badges de comptage des liens
- Lignes de connexion avec type de lien
- Effets de halo et glow
- Gradients et animations

### 6. `PanneauLateralLiens` (`app/(app)/relecture/components/links/PanneauLateralLiens.tsx`)

**Responsabilité** : Panneau latéral pour créer de nouveaux liens spirituels.

**Props** :
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `sourceEntry: any` - Élément source du lien
- `allEntries: any[]` - Toutes les entrées disponibles
- `onCreateLink: (source, destination, linkType) => void` - Callback de création
- `getEntryText: (entry) => string` - Fonction d'extraction de texte
- `getTypeConfig: (type) => any` - Configuration des types

**Fonctionnalités** :
- **Sélection du type de lien** : 5 types disponibles avec emojis
- **Recherche et filtrage** : Par texte et par type d'élément
- **Interface en 3 étapes** :
  1. Affichage de l'élément source (fixe)
  2. Sélection du type de connexion
  3. Choix de l'élément de destination
- **Validation** : Bouton désactivé tant que la destination n'est pas sélectée
- **Animations** : Transitions fluides d'ouverture/fermeture

## Intégration dans le module de relecture

### Modes de visualisation

La page de relecture (`app/(app)/relecture/page.tsx`) intègre le système de liens dans plusieurs modes :

1. **Mode chronologique** : Badges sur les éléments
2. **Mode constellation** : Vue graphique interactive
3. **Mode gestion** : Interface d'administration des liens
4. **Mode atelier** : Création assistée de liens

### Gestion des états

```typescript
const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
const [showPanneauLiens, setShowPanneauLiens] = useState(false)
const [entryForNewLink, setEntryForNewLink] = useState<any>(null)
const [updatingLink, setUpdatingLink] = useState<string | null>(null)
```

### Chargement des données

Les liens spirituels sont chargés en parallèle avec les autres données :

```typescript
// Charger les liens spirituels
const { data: linksData } = await supabase
  .from('liens_spirituels')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })

setSpiritualLinks(linksData || [])
```

### Création de liens

Processus de création d'un nouveau lien spirituel :

```typescript
async function createSpiritualLink(source: any, destination: any, linkType: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('liens_spirituels')
    .insert({
      user_id: user.id,
      element_source_type: source.type,
      element_source_id: source.id,
      element_cible_type: destination.type,
      element_cible_id: destination.id,
      type_lien: linkType,
      description: `${getEntryText(source)} ${linkType} ${getEntryText(destination)}`
    })

  if (!error) {
    // Recharger les liens
    await loadAllEntries()
    // Notification de succès
    setLinkNotification({ message: 'Lien créé avec succès', type: 'success' })
  }
}
```

## Sécurité et permissions

### Policies Supabase

Toutes les opérations sur les liens spirituels sont protégées par des RLS (Row Level Security) :

```sql
-- Politique de lecture
CREATE POLICY "Utilisateurs peuvent voir leurs liens" ON liens_spirituels
  FOR SELECT USING (auth.uid() = user_id);

-- Politique de création
CREATE POLICY "Utilisateurs peuvent créer leurs liens" ON liens_spirituels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique de suppression
CREATE POLICY "Utilisateurs peuvent supprimer leurs liens" ON liens_spirituels
  FOR DELETE USING (auth.uid() = user_id);
```

### Validation côté client

- Vérification de l'authentification avant toute opération
- Validation des types de liens
- Contrôle des doublons
- Gestion des erreurs et états de chargement

## Performances et optimisations

### Chargement des données

- **Chargement groupé** : Tous les liens sont chargés en une seule requête
- **Tri en base** : `ORDER BY created_at DESC` pour éviter le tri côté client
- **Filtrage optimisé** : Utilisation d'index sur `user_id` et les colonnes de relation

### Gestion mémoire

- **États locaux** : Éviter les re-renders inutiles
- **Callbacks optimisés** : useCallback pour les fonctions de gestion d'événements
- **Filtrage côté client** : Pour les interactions rapides

### Interface utilisateur

- **Rendu conditionnel** : Composants affichés seulement si nécessaire
- **Lazy loading** : Chargement différé des vues complexes
- **Transitions CSS** : Animations fluides sans JavaScript

## Cas d'usage typiques

### 1. Exaucement de prière

1. Utilisateur prie pour une guérison
2. Plus tard, une grâce de guérison est reçue
3. Lien "exauce" créé : Prière → Grâce
4. Visualisation dans la constellation

### 2. Accomplissement de parole

1. Parole de connaissance reçue
2. Rencontre missionnaire ultérieure
3. Lien "accomplit" créé : Parole → Rencontre
4. Suivi de l'évolution spirituelle

### 3. Éclairage scripturaire

1. Lecture d'un passage biblique
2. Situation personnelle éclairée
3. Lien "eclaire" créé : Écriture → Grâce/Rencontre
4. Compréhension des guidances divines

## Évolutions possibles

### Fonctionnalités avancées

1. **Analytics spirituels** : Statistiques sur les types de liens
2. **Suggestions automatiques** : IA pour proposer des connexions
3. **Export/Import** : Sauvegarde des constellations spirituelles
4. **Partage sélectif** : Partager certains liens avec un accompagnateur
5. **Timeline interactive** : Vue chronologique des liens

### Améliorations UX

1. **Recherche avancée** : Filtres multiples et recherche textuelle
2. **Raccourcis clavier** : Navigation rapide dans les liens
3. **Mode sombre** : Thème adapté pour la méditation
4. **Notifications** : Rappels de liens à explorer
5. **Tutoriel interactif** : Guide d'utilisation intégré

### Optimisations techniques

1. **Cache intelligent** : Mise en cache des requêtes fréquentes
2. **Synchronisation offline** : Fonctionnement hors connexion  
3. **API GraphQL** : Requêtes plus flexibles
4. **Tests automatisés** : Couverture complète des fonctionnalités
5. **Monitoring** : Suivi des performances et erreurs

## Conclusion

Le système de liens spirituels constitue le cœur relationnel du Carnet Spirituel. Il offre une approche innovante pour comprendre et visualiser les connexions entre les expériences spirituelles. Son architecture modulaire et sa conception centrée utilisateur permettent une évolution continue vers une expérience spirituelle plus riche et interconnectée.

Cette documentation technique fournit tous les éléments nécessaires pour maintenir, améliorer et étendre le système de liens spirituels dans le respect de sa philosophie originale : permettre à chacun de discerner l'action de Dieu dans sa vie à travers les connexions entre les grâces reçues, les prières exaucées, les paroles accomplies et les rencontres providentielles.