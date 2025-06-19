// Helpers pour la gestion unifiée des liens spirituels
import { supabase } from '@/app/lib/supabase'

// Types adaptés à la structure réelle de la DB
export interface SpiritualLink {
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

export interface Entry {
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

// Obtenir le nombre de liens pour une entrée
export const getLinksCountForEntry = (entryId: string, links: SpiritualLink[]): number => {
  return links.filter(link => 
    link.element_source_id === entryId || 
    link.element_cible_id === entryId
  ).length
}

// Obtenir tous les liens d'une entrée
export const getLinksForEntry = (entryId: string, entryType: string, links: SpiritualLink[]): SpiritualLink[] => {
  return links.filter(link => 
    (link.element_source_id === entryId && link.element_source_type === entryType) ||
    (link.element_cible_id === entryId && link.element_cible_type === entryType)
  )
}

// Vérifier si deux entrées sont liées
export const areEntriesLinked = (entry1Id: string, entry2Id: string, links: SpiritualLink[]): boolean => {
  return links.some(link => 
    (link.element_source_id === entry1Id && link.element_cible_id === entry2Id) ||
    (link.element_source_id === entry2Id && link.element_cible_id === entry1Id)
  )
}

// Obtenir le type de lien entre deux entrées
export const getLinkTypeBetween = (entry1Id: string, entry2Id: string, links: SpiritualLink[]): string | null => {
  const link = links.find(l => 
    (l.element_source_id === entry1Id && l.element_cible_id === entry2Id) ||
    (l.element_source_id === entry2Id && l.element_cible_id === entry1Id)
  )
  return link?.type_lien || null
}

// Formater l'affichage d'un lien
export const formatLinkDisplay = (link: SpiritualLink, entries: Entry[]): {
  sourceText: string,
  targetText: string,
  linkTypeDisplay: string,
  linkTypeEmoji: string
} => {
  const sourceEntry = entries.find(e => e.id === link.element_source_id)
  const targetEntry = entries.find(e => e.id === link.element_cible_id)
  
  const linkTypeMap: Record<string, { display: string, emoji: string }> = {
    exauce: { display: 'exauce', emoji: '🙏' },
    accomplit: { display: 'accomplit', emoji: '✓' },
    decoule: { display: 'découle de', emoji: '→' },
    eclaire: { display: 'éclaire', emoji: '💡' },
    echo: { display: 'fait écho à', emoji: '🔄' }
  }
  
  const linkType = linkTypeMap[link.type_lien] || { display: link.type_lien, emoji: '🔗' }
  
  return {
    sourceText: getEntryShortText(sourceEntry),
    targetText: getEntryShortText(targetEntry),
    linkTypeDisplay: linkType.display,
    linkTypeEmoji: linkType.emoji
  }
}

// Obtenir un texte court pour une entrée
export const getEntryShortText = (entry: Entry | undefined): string => {
  if (!entry) return 'Élément inconnu'
  
  switch (entry.type) {
    case 'grace':
      return entry.texte ? `Grâce: ${entry.texte.substring(0, 50)}...` : 'Grâce'
    case 'priere':
      return entry.personne_prenom ? `Prière pour ${entry.personne_prenom}` : 'Prière'
    case 'ecriture':
      return entry.reference || 'Écriture'
    case 'parole':
      return entry.texte ? `Parole: ${entry.texte.substring(0, 50)}...` : 'Parole'
    case 'rencontre':
      return entry.personne_prenom ? `Rencontre avec ${entry.personne_prenom}` : 'Rencontre'
    default:
      return 'Élément'
  }
}

// Charger tous les liens d'un utilisateur
export const loadUserSpiritualLinks = async (userId: string): Promise<SpiritualLink[]> => {
  try {
    const { data, error } = await supabase
      .from('liens_spirituels')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erreur lors du chargement des liens:', error)
    return []
  }
}

// Obtenir la configuration de type (emoji, couleur, etc.)
export const getTypeConfig = (type: string) => {
  const configs: Record<string, any> = {
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
  return configs[type] || { 
    emoji: "✨", 
    color: '#6b7280', 
    gradient: 'linear-gradient(135deg, #6b7280, #4b5563)', 
    label: 'Autre' 
  }
}
