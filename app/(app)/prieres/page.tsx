'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Plus, Calendar, User, Heart, Users, HandHeart, Sparkles, Search, Filter, ArrowLeft, Clock, CheckCircle } from 'lucide-react'
import { getLinksCountForEntry, getLinksForEntry } from '@/app/lib/spiritual-links-helpers'
import LinkBadge from '@/app/components/LinkBadge'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom: string | null
  date: string
  sujet: string
  sujet_detail: string | null
  nombre_fois: number
  notes: string | null
  visibilite: string
  created_at: string
  suivis_priere?: any[]
}

const typeColors = {
  guerison: {
    bg: '#FEE2E2',
    border: '#FECACA',
    text: '#991B1B',
    light: '#FEF2F2'
  },
  freres: {
    bg: '#E0E7FF',
    border: '#C7D2FE',
    text: '#3730A3',
    light: '#EEF2FF'
  },
  intercession: {
    bg: '#D1FAE5',
    border: '#A7F3D0',
    text: '#064E3B',
    light: '#ECFDF5'
  }
}

const typeLabels = {
  guerison: { label: 'Guérison', icon: Heart },
  freres: { label: 'Prière des frères', icon: Users },
  intercession: { label: 'Intercession', icon: HandHeart }
}

export default function PrieresPage() {
  const router = useRouter()
  const [prieres, setPrieres] = useState<Priere[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
  const [showLinksPopup, setShowLinksPopup] = useState<string | null>(null)
  const [allEntries, setAllEntries] = useState<any[]>([])

  useEffect(() => {
    fetchPrieres()
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

  const fetchPrieres = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('prieres')
        .select(`
          *,
          suivis_priere (
            id,
            date,
            evolution
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setPrieres(data || [])
      
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
        allEntriesData.push(...data.map(item => ({ ...item, type: 'priere' })))
      }
      
      setAllEntries(allEntriesData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrieres = prieres.filter(priere => {
    const matchesSearch = 
      priere.personne_prenom.toLowerCase().includes(filter.toLowerCase()) ||
      priere.personne_nom?.toLowerCase().includes(filter.toLowerCase()) ||
      priere.sujet.toLowerCase().includes(filter.toLowerCase()) ||
      priere.sujet_detail?.toLowerCase().includes(filter.toLowerCase())
    
    const matchesType = !selectedType || priere.type === selectedType
    
    return matchesSearch && matchesType
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getLatestEvolution = (suivis: any[]) => {
    if (!suivis || suivis.length === 0) return null
    const latest = suivis.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    return latest.evolution
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🙏</div>
          <p style={{ color: '#1E3A8A' }}>Chargement des prières...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond bleu pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1E3A8A',
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
                color: '#1E3A8A',
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
                    🙏
                  </div>
                  Mes Prières
                </div>
              </h1>
              <p style={{ color: '#1E40AF', opacity: 0.9 }}>
                {prieres.length} intention{prieres.length > 1 ? 's' : ''} de prière
              </p>
            </div>

            <Link href="/prieres/nouvelle" style={{
              background: '#93C5FD',
              color: '#1E3A8A',
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
              Nouvelle prière
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
                color: '#1E40AF',
                opacity: 0.5
              }} />
              <input
                type="text"
                placeholder="Rechercher une personne ou un sujet..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BFDBFE'}
                onBlur={(e) => e.target.style.borderColor = '#DBEAFE'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <Filter size={16} style={{ color: '#1E40AF', opacity: 0.7 }} />
              <button
                onClick={() => setSelectedType(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: !selectedType ? '#93C5FD' : '#DBEAFE',
                  color: '#1E3A8A',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Tous
              </button>
              {Object.entries(typeLabels).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      border: 'none',
                      background: selectedType === type ? typeColors[type as keyof typeof typeColors].bg : '#F3F4F6',
                      color: selectedType === type ? typeColors[type as keyof typeof typeColors].text : '#6B7280',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Icon size={14} />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Liste des prières */}
        {filteredPrieres.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <HandHeart size={48} style={{ color: '#93C5FD', margin: '0 auto 1rem' }} />
            <p style={{ color: '#1E40AF', fontSize: '1.125rem' }}>
              {filter || selectedType 
                ? 'Aucune prière ne correspond à votre recherche'
                : 'Aucune prière enregistrée pour le moment'}
            </p>
            {!filter && !selectedType && (
              <Link href="/prieres/nouvelle" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: '#1E3A8A',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <Plus size={20} />
                Ajouter votre première prière
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredPrieres.map((priere, index) => {
              const TypeIcon = typeLabels[priere.type].icon
              const colors = typeColors[priere.type]
              const evolution = getLatestEvolution(priere.suivis_priere || [])
              const linksCount = getLinksCountForEntry(priere.id, spiritualLinks)
              
              return (
                <div key={priere.id} style={{ position: 'relative' }}>
                  <Link
                    href={`/prieres/${priere.id}`}
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
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(147, 197, 253, 0.3)'
                    e.currentTarget.style.borderColor = colors.border
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* En-tête coloré selon le type */}
                  <div style={{
                    background: colors.bg,
                    borderBottom: `2px solid ${colors.border}`,
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        background: colors.light,
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TypeIcon size={20} style={{ color: colors.text }} />
                      </div>
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: colors.text,
                          fontSize: '0.875rem'
                        }}>
                          {typeLabels[priere.type].label}
                        </p>
                        <p style={{
                          fontSize: '1.125rem',
                          fontWeight: 'bold',
                          color: '#1F2937'
                        }}>
                          {priere.personne_prenom} {priere.personne_nom || ''}
                        </p>
                      </div>
                    </div>
                    
                    {evolution && (
                      <div style={{
                        background: evolution === 'gueri' || evolution === 'exauce' ? '#D1FAE5' : colors.light,
                        color: evolution === 'gueri' || evolution === 'exauce' ? '#064E3B' : colors.text,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {(evolution === 'gueri' || evolution === 'exauce') && <CheckCircle size={12} />}
                        {evolution === 'amelioration' ? 'En amélioration' :
                         evolution === 'stable' ? 'Stable' :
                         evolution === 'gueri' ? 'Guéri' :
                         evolution === 'exauce' ? 'Exaucée' :
                         evolution === 'en_cours' ? 'En cours' : evolution}
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{
                      fontSize: '1rem',
                      color: '#4B5563',
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {priere.sujet}
                      {priere.sujet_detail && (
                        <span style={{ color: '#6B7280' }}> - {priere.sujet_detail}</span>
                      )}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={16} />
                        {formatDate(priere.date)}
                      </span>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        {priere.nombre_fois > 0 && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: colors.text
                          }}>
                            <Sparkles size={16} />
                            {priere.nombre_fois} fois
                          </span>
                        )}
                        {priere.suivis_priere && priere.suivis_priere.length > 0 && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Clock size={16} />
                            {priere.suivis_priere.length} suivi{priere.suivis_priere.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Badge */}
                {linksCount > 0 && (
                  <LinkBadge
                    count={linksCount}
                    color="#6366F1"
                    size="small"
                    onClick={() => {
                      setShowLinksPopup(showLinksPopup === priere.id ? null : priere.id)
                    }}
                  />
                )}
                
                {/* Popup */}
                {showLinksPopup === priere.id && linksCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '-8px',
                    background: 'white',
                    border: '2px solid #93C5FD',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    boxShadow: '0 4px 12px rgba(147, 197, 253, 0.3)',
                    minWidth: '250px',
                    maxWidth: '350px',
                    zIndex: 1000
                  }} data-links-popup>
                    {getLinksForEntry(priere.id, 'priere', spiritualLinks).map(link => {
                      const isSource = link.element_source_id === priere.id
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
                            e.currentTarget.style.background = '#EFF6FF'
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