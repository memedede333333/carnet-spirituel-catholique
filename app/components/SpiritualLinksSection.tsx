'use client'

import { useSpiritualLinks } from '@/app/hooks/useSpiritualLinks'
import Link from 'next/link'
import { Link as LinkIcon, Trash2, Sparkles } from 'lucide-react'

interface SpiritualLinksSectionProps {
  entryId: string
  entryType: string
}

export default function SpiritualLinksSection({ entryId, entryType }: SpiritualLinksSectionProps) {
  const { links, loading, deleteLink } = useSpiritualLinks(entryId, entryType)

  const getLinkTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'exauce': '✨ Exaucement',
      'accomplit': '✓ Accomplissement',
      'decoule': '🌱 Découle de',
      'eclaire': '💡 Éclaire',
      'echo': '🔗 Fait écho à'
    }
    return labels[type] || type
  }

  const getTypeConfig = (type: string) => {
    const configs: Record<string, any> = {
      grace: { color: '#fbbf24', label: 'Grâce' },
      priere: { color: '#6366f1', label: 'Prière' },
      ecriture: { color: '#10b981', label: 'Écriture' },
      parole: { color: '#0ea5e9', label: 'Parole' },
      rencontre: { color: '#f43f5e', label: 'Rencontre' }
    }
    return configs[type] || { color: '#6b7280', label: 'Autre' }
  }

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <Sparkles size={24} style={{ color: '#a855f7', margin: '0 auto', animation: 'pulse 2s infinite' }} />
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Chargement des liens spirituels...</p>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginTop: '2rem',
        textAlign: 'center',
        border: '2px dashed #e5e7eb'
      }}>
        <LinkIcon size={32} style={{ color: '#d1d5db', margin: '0 auto' }} />
        <p style={{ color: '#9ca3af', marginTop: '1rem' }}>
          Aucun lien spirituel pour le moment
        </p>
        <Link
          href="/relecture"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: '#a855f7',
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          Créer des liens dans la relecture →
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#7c3aed'
      }}>
        <LinkIcon size={20} />
        Liens spirituels ({links.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {links.map(link => {
          const isSource = link.element_source_id === entryId
          const targetType = isSource ? link.element_cible_type : link.element_source_type
          const targetId = isSource ? link.element_cible_id : link.element_source_id
          const config = getTypeConfig(targetType)
          
          return (
            <div
              key={link.id}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#a855f7'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem'
              }}>
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (confirm('Supprimer ce lien ?')) {
                      await deleteLink(link.id)
                    }
                  }}
                  style={{
                    background: '#fee2e2',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    color: '#dc2626'
                  }}
                  title="Supprimer ce lien"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  background: '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {getLinkTypeLabel(link.type_lien)}
                </span>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: '#4b5563',
                marginBottom: '0.5rem'
              }}>
                {link.description}
              </p>

              <Link
                href={`/${targetType}s/${targetId}`}
                style={{
                  fontSize: '0.813rem',
                  color: config.color,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {isSource ? 'Vers' : 'Depuis'} {config.label} →
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
