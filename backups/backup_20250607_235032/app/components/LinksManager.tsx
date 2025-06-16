'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { X, Link as LinkIcon, Trash2, Eye } from 'lucide-react'

interface Link {
  id: string
  element_source_type: string
  element_source_id: string
  element_cible_type: string
  element_cible_id: string
  type_lien: string
  description: string
  created_at: string
}

interface LinksManagerProps {
  entryId: string
  entryType: string
  onClose: () => void
}

export default function LinksManager({ entryId, entryType, onClose }: LinksManagerProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLinks()
  }, [entryId])

  async function loadLinks() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Charger les liens où cet élément est source ou cible
      const { data, error } = await supabase
        .from('liens_spirituels')
        .select('*')
        .eq('user_id', user.id)
        .or(`element_source_id.eq.${entryId},element_cible_id.eq.${entryId}`)

      if (!error && data) {
        setLinks(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteLink(linkId: string) {
    if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return

    try {
      const { error } = await supabase
        .from('liens_spirituels')
        .delete()
        .eq('id', linkId)

      if (!error) {
        setLinks(links.filter(l => l.id !== linkId))
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const getLinkTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'exauce': '✨ Exaucement',
      'accomplit': '✓ Accomplissement',
      'decoule': '🌱 Fruit',
      'eclaire': '💡 Illumination',
      'echo': '🔗 Résonance'
    }
    return labels[type] || type
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            <LinkIcon style={{ display: 'inline', marginRight: '0.5rem' }} size={20} />
            Liens spirituels
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#6b7280'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</p>
        ) : links.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <LinkIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Aucun lien spirituel pour cet élément.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Utilisez le mode lien dans la relecture pour créer des connexions.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.map(link => {
              const isSource = link.element_source_id === entryId
              const targetType = isSource ? link.element_cible_type : link.element_source_type
              const targetId = isSource ? link.element_cible_id : link.element_source_id
              
              return (
                <div
                  key={link.id}
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem'
                  }}>
                    <button
                      onClick={() => deleteLink(link.id)}
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
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.813rem',
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

                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{isSource ? 'Vers' : 'Depuis'}</span>
                    <span style={{
                      background: '#e5e7eb',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}>
                      {targetType}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
