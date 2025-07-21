'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Plus, Calendar, MapPin, Users, Heart, Search, Filter, ArrowLeft } from 'lucide-react'
import { getLinksCountForEntry, getLinksForEntry } from '@/app/lib/spiritual-links-helpers'
import LinkBadge from '@/app/components/LinkBadge'

interface Rencontre {
  id: string
  personne_prenom: string
  personne_nom: string | null
  lieu: string
  date: string
  contexte: string
  description: string
  fruit_immediat: string | null
  fruit_espere: string | null
  visibilite: string
  created_at: string
}

export default function RencontresPage() {
  const router = useRouter()
  const [rencontres, setRencontres] = useState<Rencontre[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedContexte, setSelectedContexte] = useState<string | null>(null)
  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
  const [showLinksPopup, setShowLinksPopup] = useState<string | null>(null)
  const [allEntries, setAllEntries] = useState<any[]>([])

  const contexteOptions = [
    { value: 'rue', label: 'Dans la rue' },
    { value: 'paroisse', label: 'À la paroisse' },
    { value: 'mission', label: 'En mission' },
    { value: 'travail', label: 'Au travail' },
    { value: 'quotidien', label: 'Vie quotidienne' },
    { value: 'autre', label: 'Autre' }
  ]

  useEffect(() => {
    fetchRencontres()
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

  const fetchRencontres = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('rencontres_missionnaires')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setRencontres(data || [])
      
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
        { name: 'paroles_ecriture', type: 'ecriture' },
        { name: 'paroles_connaissance', type: 'parole' },
        { name: 'prieres', type: 'priere' }
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
        allEntriesData.push(...data.map(item => ({ ...item, type: 'rencontre' })))
      }
      
      setAllEntries(allEntriesData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRencontres = rencontres.filter(rencontre => {
    const matchesSearch = 
      rencontre.personne_prenom.toLowerCase().includes(filter.toLowerCase()) ||
      rencontre.personne_nom?.toLowerCase().includes(filter.toLowerCase()) ||
      rencontre.lieu.toLowerCase().includes(filter.toLowerCase()) ||
      rencontre.description.toLowerCase().includes(filter.toLowerCase())
    
    const matchesContexte = !selectedContexte || rencontre.contexte === selectedContexte
    
    return matchesSearch && matchesContexte
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getContexteLabel = (contexte: string) => {
    return contexteOptions.find(c => c.value === contexte)?.label || contexte
  }

  const getEntryShortText = (entry: any): string => {
    if (!entry) return ''
    
    switch (entry.type) {
      case 'grace':
        return entry.texte?.substring(0, 50) + '...' || ''
      case 'priere':
        return `Prière pour ${entry.personne_prenom || ''}`
      case 'ecriture':
        return entry.reference || ''
      case 'parole':
        return entry.texte?.substring(0, 50) + '...' || ''
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
          <div style={{
            background: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 2px 4px rgba(198, 93, 0, 0.2)',
            margin: '0 auto 1rem'
          }}>
            🤝
          </div>
          <p style={{ color: '#451A03' }}>Chargement des rencontres...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond rose pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #FED7AA, #FDBA74)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#451A03',
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
                color: '#451A03',
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
                    boxShadow: '0 2px 4px rgba(198, 93, 0, 0.2)',
                    marginRight: '1rem'
                  }}>
                    🤝
                  </div>
                  Rencontres missionnaires
                </div>
              </h1>
              <p style={{ color: '#92400E', opacity: 0.9 }}>
                {rencontres.length} rencontre{rencontres.length > 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/rencontres/nouvelle" style={{
              background: '#C65D00',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D97706'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C65D00'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <Plus size={20} />
              Nouvelle rencontre
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
                color: '#92400E',
                opacity: 0.5
              }} />
              <input
                type="text"
                placeholder="Rechercher une personne, un lieu..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #FED7AA',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#FFF7ED',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Filter size={16} style={{ color: '#92400E', opacity: 0.7 }} />
              <button
                onClick={() => setSelectedContexte(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: !selectedContexte ? '#C65D00' : '#FED7AA',
                  color: !selectedContexte ? 'white' : '#451A03',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Tous contextes
              </button>
              {contexteOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedContexte(option.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: 'none',
                    background: selectedContexte === option.value ? '#C65D00' : '#FED7AA',
                    color: selectedContexte === option.value ? 'white' : '#451A03',
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

        {/* Liste des rencontres */}
        {filteredRencontres.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <Users size={48} style={{ color: '#C65D00', margin: '0 auto 1rem' }} />
            <p style={{ color: '#92400E', fontSize: '1.125rem' }}>
              {filter || selectedContexte 
                ? 'Aucune rencontre ne correspond à vos critères'
                : 'Aucune rencontre enregistrée pour le moment'}
            </p>
            {!filter && !selectedContexte && (
              <Link href="/rencontres/nouvelle" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: '#451A03',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <Plus size={20} />
                Noter votre première rencontre
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredRencontres.map((rencontre, index) => (
              <div key={rencontre.id} style={{ position: 'relative' }}>
                <Link
                  href={`/rencontres/${rencontre.id}`}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s',
                    display: 'block',
                    border: '2px solid transparent',
                    animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(198, 93, 0, 0.15)'
                    e.currentTarget.style.borderColor = '#FED7AA'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* En-tête avec dégradé rose */}
                  <div style={{
                    background: 'linear-gradient(135deg, #FED7AA, #FDBA74)',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #FED7AA'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#451A03',
                        margin: 0
                      }}>
                        {rencontre.personne_prenom} {rencontre.personne_nom || ''}
                      </h3>
                      <span style={{
                        background: '#FFF7ED',
                        color: '#92400E',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {getContexteLabel(rencontre.contexte)}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{
                      color: '#374151',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {rencontre.description}
                    </p>

                    {(rencontre.fruit_immediat || rencontre.fruit_espere) && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        {rencontre.fruit_immediat && (
                          <div style={{
                            background: '#FFFBEB',
                            border: '1px solid #FEF3C7',
                            borderRadius: '0.5rem',
                            padding: '0.75rem'
                          }}>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#78350F',
                              margin: 0,
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem'
                            }}>
                              <Heart size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#D97706' }} />
                              <span><strong>Fruit immédiat :</strong> {rencontre.fruit_immediat}</span>
                            </p>
                          </div>
                        )}
                        {rencontre.fruit_espere && (
                          <div style={{
                            background: '#F0F4FF',
                            border: '1px solid #E0E7FF',
                            borderRadius: '0.5rem',
                            padding: '0.75rem'
                          }}>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#1E3A8A',
                              margin: 0,
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem'
                            }}>
                              <Heart size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#3B82F6' }} />
                              <span><strong>Fruit espéré :</strong> {rencontre.fruit_espere}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#92400E',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #FED7AA'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={16} />
                        {formatDate(rencontre.date)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={16} />
                        {rencontre.lieu}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Badge */}
                {getLinksCountForEntry(rencontre.id, spiritualLinks) > 0 && (
                  <LinkBadge
                    count={getLinksCountForEntry(rencontre.id, spiritualLinks)}
                    color="#C65D00"
                    size="small"
                    onClick={() => {
                      setShowLinksPopup(showLinksPopup === rencontre.id ? null : rencontre.id)
                    }}
                  />
                )}

                {/* Popup */}
                {showLinksPopup === rencontre.id && getLinksCountForEntry(rencontre.id, spiritualLinks) > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '-8px',
                    background: 'white',
                    border: '2px solid #C65D00',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    boxShadow: '0 4px 12px rgba(198, 93, 0, 0.3)',
                    minWidth: '250px',
                    maxWidth: '350px',
                    zIndex: 1000
                  }} data-links-popup>
                    {getLinksForEntry(rencontre.id, 'rencontre', spiritualLinks).map(link => {
                      const isSource = link.element_source_id === rencontre.id
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
                            e.currentTarget.style.background = '#FFF7ED'
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}