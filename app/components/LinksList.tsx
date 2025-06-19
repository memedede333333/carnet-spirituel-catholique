'use client'

import { Eye, Trash2 } from 'lucide-react'
import { formatLinkDisplay, getTypeConfig, getEntryShortText } from '@/app/lib/spiritual-links-helpers'
import type { SpiritualLink, Entry } from '@/app/lib/spiritual-links-helpers'

interface LinksListProps {
  entryId: string
  links: SpiritualLink[]
  entries: Entry[]
  onViewEntry?: (entryId: string) => void
  onDeleteLink?: (linkId: string) => void
  showActions?: boolean
  maxItems?: number
}

export default function LinksList({ 
  entryId, 
  links, 
  entries, 
  onViewEntry, 
  onDeleteLink,
  showActions = true,
  maxItems
}: LinksListProps) {
  // Filtrer les liens pertinents pour cette entrée
  const relevantLinks = links.filter(link => 
    link.element_source_id === entryId || link.element_cible_id === entryId
  )

  // Limiter si nécessaire
  const displayLinks = maxItems ? relevantLinks.slice(0, maxItems) : relevantLinks

  if (relevantLinks.length === 0) {
    return (
      <div style={{
        padding: '1rem',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.875rem'
      }}>
        Aucun lien spirituel pour le moment
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {displayLinks.map((link) => {
        const isSource = link.element_source_id === entryId
        const otherEntryId = isSource ? link.element_cible_id : link.element_source_id
        const otherEntry = entries.find(e => e.id === otherEntryId)
        
        if (!otherEntry) return null

        const { linkTypeDisplay, linkTypeEmoji } = formatLinkDisplay(link, entries)
        const otherConfig = getTypeConfig(otherEntry.type)

        return (
          <div
            key={link.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              background: 'white',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = otherConfig.color
              e.currentTarget.style.background = otherConfig.color + '10'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.background = 'white'
            }}
            onClick={() => onViewEntry && onViewEntry(otherEntryId)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              {/* Direction et type de lien */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {isSource ? (
                  <>
                    <span>{linkTypeEmoji}</span>
                    <span>{linkTypeDisplay}</span>
                    <span>→</span>
                  </>
                ) : (
                  <>
                    <span>←</span>
                    <span>est {linkTypeDisplay} par</span>
                  </>
                )}
              </div>

              {/* Élément lié */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{otherConfig.emoji}</span>
                <div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    fontWeight: '500'
                  }}>
                    {getEntryShortText(otherEntry)}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {new Date(otherEntry.date || otherEntry.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {onViewEntry && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewEntry(otherEntryId)
                    }}
                    style={{
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.color = '#4b5563'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                    title="Voir le détail"
                  >
                    <Eye size={16} />
                  </button>
                )}
                {onDeleteLink && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Supprimer ce lien spirituel ?')) {
                        onDeleteLink(link.id)
                      }
                    }}
                    style={{
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                      e.currentTarget.style.color = '#ef4444'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                    title="Supprimer le lien"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Afficher le nombre restant si limité */}
      {maxItems && relevantLinks.length > maxItems && (
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6b7280',
          marginTop: '0.5rem'
        }}>
          Et {relevantLinks.length - maxItems} autre{relevantLinks.length - maxItems > 1 ? 's' : ''} lien{relevantLinks.length - maxItems > 1 ? 's' : ''}...
        </p>
      )}
    </div>
  )
}
