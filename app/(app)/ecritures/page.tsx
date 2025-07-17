'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Plus, Calendar, Book, Heart, Search, Filter, ArrowLeft } from 'lucide-react'
import { getLinksCountForEntry, getLinksForEntry } from '@/app/lib/spiritual-links-helpers'
import LinkBadge from '@/app/components/LinkBadge'

interface Ecriture {
  id: string
  reference: string
  texte_complet: string
  traduction: string
  contexte: string
  date_reception: string
  ce_qui_ma_touche: string
  pour_qui: string
  fruits: string[]
  created_at: string
}

export default function EcrituresPage() {
  const router = useRouter()
  const [ecritures, setEcritures] = useState<Ecriture[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedContext, setSelectedContext] = useState<string | null>(null)
  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
  const [showLinksPopup, setShowLinksPopup] = useState<string | null>(null)
  const [allEntries, setAllEntries] = useState<any[]>([])

  const contextOptions = [
    { value: 'messe', label: 'Messe' },
    { value: 'lectio', label: 'Lectio Divina' },
    { value: 'retraite', label: 'Retraite' },
    { value: 'groupe', label: 'Groupe de prière' },
    { value: 'personnel', label: 'Personnel' }
  ]

  useEffect(() => {
    fetchEcritures()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (showLinksPopup && !target.closest('[data-links-popup]')) {
        setShowLinksPopup(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLinksPopup])

  const fetchEcritures = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('paroles_ecriture')
        .select('*')
        .eq('user_id', user.id)
        .order('date_reception', { ascending: false })

      if (error) throw error
      setEcritures(data || [])
      
      // Charger les liens spirituels
      const { data: linksData } = await supabase
        .from('liens_spirituels')
        .select('*')
        .eq('user_id', user.id)
      
      setSpiritualLinks(linksData || [])
      
      // Charger toutes les entrées pour les popups
      const allEntriesData: any[] = []
      
      const tables = [
        { name: 'graces', type: 'grace' },
        { name: 'prieres', type: 'priere' },
        { name: 'paroles_connaissance', type: 'parole' },
        { name: 'rencontres_missionnaires', type: 'rencontre' }
      ]
      
      for (const table of tables) {
        const { data: tableData } = await supabase
          .from(table.name)
          .select('*')
          .eq('user_id', user.id)
        
        if (tableData) {
          allEntriesData.push(...tableData.map(item => ({ ...item, type: table.type })))
        }
      }
      
      if (data) {
        allEntriesData.push(...data.map(item => ({ ...item, type: 'ecriture' })))
      }
      
      setAllEntries(allEntriesData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEcritures = ecritures.filter(ecriture => {
    const matchesSearch = 
      ecriture.reference.toLowerCase().includes(filter.toLowerCase()) ||
      ecriture.texte_complet.toLowerCase().includes(filter.toLowerCase()) ||
      ecriture.ce_qui_ma_touche.toLowerCase().includes(filter.toLowerCase())
    
    const matchesContext = !selectedContext || ecriture.contexte === selectedContext
    
    return matchesSearch && matchesContext
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getContextLabel = (context: string) => {
    return contextOptions.find(c => c.value === context)?.label || context
  }

  const getEntryShortText = (entry: any): string => {
    if (!entry) return ''
    
    switch (entry.type) {
      case 'grace':
        return entry.texte?.substring(0, 50) + '...'
      case 'priere':
        return `Prière pour ${entry.personne_prenom || ''}`
      case 'ecriture':
        return entry.reference || ''
      case 'parole':
        return entry.texte?.substring(0, 50) + '...'
      case 'rencontre':
        return `Rencontre avec ${entry.personne_prenom || ''}`
      default:
        return 'Élément'
    }
  }

  const getEntryRoute = (entry: any): string => {
    const routes: { [key: string]: string } = {
      grace: 'graces',
      priere: 'prieres',
      ecriture: 'ecritures',
      parole: 'paroles',
      rencontre: 'rencontres'
    }
    return routes[entry.type] || ''
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>📖</div>
          <p style={{ color: '#064E3B' }}>Chargement des écritures...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond vert pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#064E3B',
            textDecoration: 'none',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}>
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Link>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#064E3B',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    background: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginRight: '1rem'
                  }}>
                    📖
                  </div>
                  Paroles d'Écriture
                </div>
              </h1>
              <p style={{ color: '#047857', opacity: 0.9 }}>
                {ecritures.length} passage{ecritures.length > 1 ? 's' : ''} mémorisé{ecritures.length > 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/ecritures/nouvelle" style={{
              background: '#6EE7B7',
              color: '#064E3B',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}>
              <Plus size={20} />
              Nouveau passage
            </Link>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{
              flex: 1,
              minWidth: '250px',
              position: 'relative'
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#047857',
                opacity: 0.5
              }} />
              <input
                type="text"
                placeholder="Rechercher une référence, un texte..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #D1FAE5',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0FDF4'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Filter size={16} style={{ color: '#047857', opacity: 0.7 }} />
              <button
                onClick={() => setSelectedContext(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: !selectedContext ? '#6EE7B7' : '#D1FAE5',
                  color: '#064E3B',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Tous
              </button>
              {contextOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedContext(option.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: 'none',
                    background: selectedContext === option.value ? '#6EE7B7' : '#D1FAE5',
                    color: '#064E3B',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des écritures */}
        {filteredEcritures.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <Book size={48} style={{ color: '#6EE7B7', margin: '0 auto 1rem' }} />
            <p style={{ color: '#047857', fontSize: '1.125rem' }}>
              {filter || selectedContext 
                ? 'Aucun passage ne correspond à votre recherche'
                : 'Aucun passage mémorisé pour le moment'}
            </p>
            {!filter && !selectedContext && (
              <Link href="/ecritures/nouvelle" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: '#064E3B',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <Plus size={20} />
                Ajouter votre premier passage
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredEcritures.map((ecriture, index) => {
              const linksCount = getLinksCountForEntry(ecriture.id, spiritualLinks)
              
              return (
                <div key={ecriture.id} style={{ position: 'relative' }}>
                  <Link
                    href={`/ecritures/${ecriture.id}`}
                    style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s',
                  display: 'block',
                  border: '2px solid transparent',
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(110, 231, 183, 0.2)'
                  e.currentTarget.style.borderColor = '#A7F3D0'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    background: '#D1FAE5',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    flexShrink: 0
                  }}>
                    <Book size={24} style={{ color: '#064E3B' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#064E3B',
                      marginBottom: '0.25rem'
                    }}>
                      {ecriture.reference}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#047857',
                      marginBottom: '0.75rem'
                    }}>
                      {ecriture.traduction}
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {ecriture.texte_complet}
                    </p>
                  </div>
                </div>

                {ecriture.ce_qui_ma_touche && (
                  <div style={{
                    background: '#F0FDF4',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#064E3B',
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <Heart size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {ecriture.ce_qui_ma_touche}
                    </p>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: '#047857',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #D1FAE5'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={16} />
                    {formatDate(ecriture.date_reception)}
                  </span>
                  <span style={{
                    background: '#D1FAE5',
                    color: '#064E3B',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }}>
                    {getContextLabel(ecriture.contexte)}
                  </span>
                </div>
              </Link>
              
              {/* Badge */}
              {linksCount > 0 && (
                <LinkBadge
                  count={linksCount}
                  color="#10B981"
                  size="small"
                  onClick={() => {
                    setShowLinksPopup(showLinksPopup === ecriture.id ? null : ecriture.id)
                  }}
                />
              )}
              
              {/* Popup */}
              {showLinksPopup === ecriture.id && linksCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  right: '-8px',
                  background: 'white',
                  border: '2px solid #34D399',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                  minWidth: '250px',
                  maxWidth: '350px',
                  zIndex: 1000
                }} data-links-popup>
                  {getLinksForEntry(ecriture.id, 'ecriture', spiritualLinks).map(link => {
                    const isSource = link.element_source_id === ecriture.id
                    const targetId = isSource ? link.element_cible_id : link.element_source_id
                    const targetEntry = allEntries.find(e => e.id === targetId)
                    
                    if (!targetEntry) return null
                    
                    const linkTypeConfig: { [key: string]: { emoji: string, label: string } } = {
                      exauce: { emoji: '🙏', label: 'exauce' },
                      accomplit: { emoji: '✓', label: 'accomplit' },
                      decoule: { emoji: '→', label: 'découle' },
                      eclaire: { emoji: '💡', label: 'éclaire' },
                      echo: { emoji: '🔄', label: 'fait écho' }
                    }
                    
                    const linkType = linkTypeConfig[link.type_lien] || { emoji: '🔗', label: link.type_lien }
                    
                    return (
                      <div
                        key={link.id}
                        onClick={() => {
                          const route = getEntryRoute(targetEntry)
                          if (route) {
                            router.push(`/${route}/${targetId}`)
                          }
                        }}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          transition: 'background 0.2s',
                          marginBottom: '0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F0FDF4'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{linkType.emoji}</span>
                        <span style={{ flex: 1, color: '#4b5563' }}>
                          {isSource && `${linkType.label} → `}
                          {getEntryShortText(targetEntry)}
                          {!isSource && ` ← ${linkType.label}`}
                        </span>
                        <span style={{ opacity: 0.6, fontSize: '0.875rem' }}>👁️</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            )
          })}
          </div>
        )}
      </div>
    </div>
  )
}