'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Plus, Calendar, MapPin, Users, Heart, Search, Filter, ArrowLeft } from 'lucide-react'

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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🤝</div>
          <p style={{ color: '#831843' }}>Chargement des rencontres...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond rose pastel */}
        <div style={{
          background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#831843',
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
                color: '#831843',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Users size={32} />
                Rencontres missionnaires
              </h1>
              <p style={{ color: '#9F1239', opacity: 0.9 }}>
                {rencontres.length} rencontre{rencontres.length > 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/rencontres/nouvelle" style={{
              background: '#F9A8D4',
              color: '#831843',
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
                color: '#9F1239',
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
                  border: '2px solid #FCE7F3',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#FFF5F7'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FBCFE8'}
                onBlur={(e) => e.target.style.borderColor = '#FCE7F3'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Filter size={16} style={{ color: '#9F1239', opacity: 0.7 }} />
              <button
                onClick={() => setSelectedContexte(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: !selectedContexte ? '#F9A8D4' : '#FCE7F3',
                  color: '#831843',
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
                    background: selectedContexte === option.value ? '#F9A8D4' : '#FCE7F3',
                    color: '#831843',
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
            <Users size={48} style={{ color: '#F9A8D4', margin: '0 auto 1rem' }} />
            <p style={{ color: '#9F1239', fontSize: '1.125rem' }}>
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
                color: '#831843',
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
              <Link
                key={rencontre.id}
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
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(249, 168, 212, 0.2)'
                  e.currentTarget.style.borderColor = '#FBCFE8'
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
                  background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #FCE7F3'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#831843',
                      margin: 0
                    }}>
                      {rencontre.personne_prenom} {rencontre.personne_nom || ''}
                    </h3>
                    <span style={{
                      background: '#FFF5F7',
                      color: '#9F1239',
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
                      background: '#FFF5F7',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      {rencontre.fruit_immediat && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#831843',
                          marginBottom: rencontre.fruit_espere ? '0.5rem' : 0,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem'
                        }}>
                          <Heart size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span><strong>Fruit immédiat :</strong> {rencontre.fruit_immediat}</span>
                        </p>
                      )}
                      {rencontre.fruit_espere && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#831843',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem'
                        }}>
                          <Heart size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span><strong>Fruit espéré :</strong> {rencontre.fruit_espere}</span>
                        </p>
                      )}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#9F1239',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #FCE7F3'
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}