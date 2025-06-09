'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Sparkles, Tag, Eye, Search, Filter, ArrowLeft } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Grace {
  id: string
  texte: string
  date: string
  lieu?: string
  tags?: string[]
  visibilite: string
  created_at: string
}

export default function GracesPage() {
  const [graces, setGraces] = useState<Grace[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    fetchGraces()
  }, [])

  const fetchGraces = async () => {
    try {
      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setGraces(data || [])
      
      // Extraire tous les tags uniques
      const tags = new Set<string>()
      data?.forEach(grace => {
        grace.tags?.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGraces = graces.filter(grace => {
    const matchesSearch = grace.texte.toLowerCase().includes(filter.toLowerCase()) ||
                         grace.lieu?.toLowerCase().includes(filter.toLowerCase()) ||
                         grace.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    
    const matchesTag = !selectedTag || grace.tags?.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>✨</div>
          <p style={{ color: '#78350F' }}>Chargement des grâces...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond jaune pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#78350F',
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
                color: '#78350F',
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
                    ✨
                  </div>
                  Mes grâces reçues
                </div>
              </h1>
              <p style={{ color: '#92400E', opacity: 0.9 }}>
                {graces.length} grâce{graces.length > 1 ? 's' : ''} reçue{graces.length > 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/graces/nouvelle" style={{
              background: '#FCD34D',
              color: '#78350F',
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
              Noter une grâce
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
                placeholder="Rechercher dans mes grâces..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #FEF3C7',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#FFFEF7'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FDE68A'}
                onBlur={(e) => e.target.style.borderColor = '#FEF3C7'}
              />
            </div>

            {allTags.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <Filter size={16} style={{ color: '#92400E', opacity: 0.7 }} />
                <button
                  onClick={() => setSelectedTag(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: 'none',
                    background: !selectedTag ? '#FCD34D' : '#FEF3C7',
                    color: '#78350F',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Tous
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      border: 'none',
                      background: selectedTag === tag ? '#FCD34D' : '#FEF3C7',
                      color: '#78350F',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste des grâces */}
        {filteredGraces.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <Sparkles size={48} style={{ color: '#FCD34D', margin: '0 auto 1rem' }} />
            <p style={{ color: '#92400E', fontSize: '1.125rem' }}>
              {filter || selectedTag 
                ? 'Aucune grâce ne correspond à votre recherche'
                : 'Aucune grâce notée pour le moment'}
            </p>
            {!filter && !selectedTag && (
              <Link href="/graces/nouvelle" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                color: '#78350F',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                <Plus size={20} />
                Noter votre première grâce
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredGraces.map((grace, index) => (
              <Link
                key={grace.id}
                href={`/graces/${grace.id}`}
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
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(252, 211, 77, 0.2)'
                  e.currentTarget.style.borderColor = '#FDE68A'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#1F2937',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}>
                    {grace.texte}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: '#92400E',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={16} />
                      {format(new Date(grace.date), 'd MMMM yyyy', { locale: fr })}
                    </span>
                    {grace.lieu && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={16} />
                        {grace.lieu}
                      </span>
                    )}
                  </div>
                </div>

                {grace.tags && grace.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginTop: '0.75rem'
                  }}>
                    {grace.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          background: '#FEF3C7',
                          color: '#78350F',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #FEF3C7'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#92400E'
                  }}>
                    <Eye size={16} />
                    {grace.visibilite === 'prive' ? 'Privé' : 
                     grace.visibilite === 'anonyme' ? 'Anonyme' : 'Public'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
