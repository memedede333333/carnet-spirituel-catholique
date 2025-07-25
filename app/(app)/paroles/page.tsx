'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Plus, Calendar, MessageSquare, Users, CheckCircle, Search, Filter, ArrowLeft } from 'lucide-react'
import { getLinksCountForEntry, getLinksForEntry } from '@/app/lib/spiritual-links-helpers'
import LinkBadge from '@/app/components/LinkBadge'

interface Parole {
  id: string
  texte: string
  date: string
  contexte: string
  contexte_detail: string | null
  destinataire: string
  personne_destinataire: string | null
  fruit_constate: string | null
  date_accomplissement: string | null
  created_at: string
}

export default function ParolesPage() {
  const router = useRouter()
  const [paroles, setParoles] = useState<Parole[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedContexte, setSelectedContexte] = useState<string | null>(null)
  const [showAccomplies, setShowAccomplies] = useState<boolean | null>(null)
  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
  const [showLinksPopup, setShowLinksPopup] = useState<string | null>(null)
  const [allEntries, setAllEntries] = useState<any[]>([])

  const contexteOptions = [
    { value: 'personnelle', label: 'Personnelle' },
    { value: 'veillee', label: 'Veillée' },
    { value: 'mission', label: 'Mission' },
    { value: 'priere', label: 'Prière' },
    { value: 'autre', label: 'Autre' }
  ]

  useEffect(() => {
    fetchParoles()
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

  const fetchParoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('paroles_connaissance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setParoles(data || [])
      
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
        { name: 'paroles_ecriture', type: 'ecriture' },
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
        allEntriesData.push(...data.map(item => ({ ...item, type: 'parole' })))
      }
      
      setAllEntries(allEntriesData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParoles = paroles.filter(parole => {
    const matchesSearch = 
      parole.texte.toLowerCase().includes(filter.toLowerCase()) ||
      parole.personne_destinataire?.toLowerCase().includes(filter.toLowerCase()) ||
      parole.fruit_constate?.toLowerCase().includes(filter.toLowerCase())
    
    const matchesContexte = !selectedContexte || parole.contexte === selectedContexte
    const matchesAccompli = showAccomplies === null || 
      (showAccomplies ? parole.date_accomplissement !== null : parole.date_accomplissement === null)
    
    return matchesSearch && matchesContexte && matchesAccompli
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

  const getDestinataire = (parole: Parole) => {
    if (parole.destinataire === 'moi') return 'Pour moi'
    if (parole.destinataire === 'inconnu') return 'Destinataire inconnu'
    return parole.personne_destinataire || 'Pour quelqu\'un'
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🕊️</div>
          <p style={{ color: '#075985' }}>Chargement des paroles...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond bleu ciel pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#075985',
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
                color: '#075985',
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
                    🕊️
                  </div>
                  Paroles de connaissance
                </div>
              </h1>
              <p style={{ color: '#0C4A6E', opacity: 0.9 }}>
                {paroles.length} parole{paroles.length > 1 ? 's' : ''} reçue{paroles.length > 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/paroles/nouvelle" style={{
              background: '#7DD3FC',
              color: '#075985',
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
              Nouvelle parole
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
                color: '#0C4A6E',
                opacity: 0.5
              }} />
              <input
                type="text"
                placeholder="Rechercher une parole, un destinataire..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #E0F2FE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Filter size={16} style={{ color: '#0C4A6E', opacity: 0.7 }} />
              
              {/* Filtre par contexte */}
              <button
                onClick={() => setSelectedContexte(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: !selectedContexte ? '#7DD3FC' : '#E0F2FE',
                  color: '#075985',
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
                    background: selectedContexte === option.value ? '#7DD3FC' : '#E0F2FE',
                    color: '#075985',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
              
              {/* Filtre accomplies/non accomplies */}
              <div style={{ marginLeft: '1rem', borderLeft: '1px solid #E0F2FE', paddingLeft: '1rem' }}>
                <button
                  onClick={() => setShowAccomplies(showAccomplies === true ? null : true)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: 'none',
                    background: showAccomplies === true ? '#10B981' : '#E0F2FE',
                    color: showAccomplies === true ? 'white' : '#075985',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginRight: '0.5rem'
                  }}
                >
                  Accomplies
                </button>
                <button
                  onClick={() => setShowAccomplies(showAccomplies === false ? null : false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: 'none',
                    background: showAccomplies === false ? '#F59E0B' : '#E0F2FE',
                    color: showAccomplies === false ? 'white' : '#075985',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  En attente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des paroles */}
        {filteredParoles.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <MessageSquare size={48} style={{ color: '#7DD3FC', margin: '0 auto 1rem' }} />
            <p style={{ color: '#0C4A6E', fontSize: '1.125rem' }}>
              {filter || selectedContexte || showAccomplies !== null
                ? 'Aucune parole ne correspond à vos critères'
                : 'Aucune parole enregistrée pour le moment'}
            </p>
            {!filter && !selectedContexte && showAccomplies === null && (
              <Link href="/paroles/nouvelle" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: '#075985',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <Plus size={20} />
                Noter votre première parole
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredParoles.map((parole, index) => {
              const linksCount = getLinksCountForEntry(parole.id, spiritualLinks)
              
              return (
                <div key={parole.id} style={{ position: 'relative' }}>
                  <Link
                    href={`/paroles/${parole.id}`}
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
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(125, 211, 252, 0.2)'
                      e.currentTarget.style.borderColor = '#BAE6FD'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {parole.date_accomplissement && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '30px',
                        background: '#10B981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <CheckCircle size={14} />
                        Accomplie
                      </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{
                        fontSize: '1.125rem',
                        color: '#1F2937',
                        lineHeight: '1.6',
                        marginBottom: '1rem',
                        fontStyle: 'italic'
                      }}>
                        « {parole.texte} »
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#075985'
                      }}>
                        <Users size={16} />
                        <span style={{ fontWeight: '500' }}>{getDestinataire(parole)}</span>
                      </div>

                      {parole.fruit_constate && (
                        <div style={{
                          background: '#F0FDF4',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          marginTop: '0.75rem'
                        }}>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#065F46',
                            lineHeight: '1.5'
                          }}>
                            <strong>Fruit constaté :</strong> {parole.fruit_constate}
                          </p>
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#0C4A6E',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #E0F2FE'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={16} />
                        {formatDate(parole.date)}
                      </span>
                      <span style={{
                        background: '#E0F2FE',
                        color: '#075985',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem'
                      }}>
                        {getContexteLabel(parole.contexte)}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Badge */}
                  {linksCount > 0 && (
                    <LinkBadge
                      count={linksCount}
                      color="#0EA5E9"
                      size="small"
                      onClick={() => {
                        setShowLinksPopup(showLinksPopup === parole.id ? null : parole.id)
                      }}
                    />
                  )}
                  
                  {/* Popup */}
                  {showLinksPopup === parole.id && linksCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '30px',
                      right: '-8px',
                      background: 'white',
                      border: '2px solid #38BDF8',
                      borderRadius: '0.75rem',
                      padding: '0.75rem',
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                      minWidth: '250px',
                      maxWidth: '350px',
                      zIndex: 1000
                    }} data-links-popup>
                      {getLinksForEntry(parole.id, 'parole', spiritualLinks).map(link => {
                        const isSource = link.element_source_id === parole.id
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
                              e.currentTarget.style.background = '#F0F9FF'
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