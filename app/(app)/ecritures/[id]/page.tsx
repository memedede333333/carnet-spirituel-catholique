'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Calendar, Book, Heart, User, Sparkles, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Ecriture {
  id: string
  reference: string
  texte_complet: string
  traduction: string
  contexte: string
  date_reception: string
  ce_qui_ma_touche: string | null
  pour_qui: string
  fruits: string[] | null
  created_at: string
}

const contexteLabels: Record<string, string> = {
  messe: 'Messe',
  lectio: 'Lectio Divina',
  retraite: 'Retraite',
  groupe: 'Groupe de prière',
  personnel: 'Personnel'
}

export default function EcritureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [ecriture, setEcriture] = useState<Ecriture | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchEcriture()
  }, [resolvedParams.id])

  const fetchEcriture = async () => {
    try {
      const { data, error } = await supabase
        .from('paroles_ecriture')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setEcriture(data)
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/ecritures')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce passage biblique ?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('paroles_ecriture')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/ecritures')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

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
            margin: '0 auto 1rem'
          }}>📖</div>
          <p style={{ color: '#064E3B' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!ecriture) return null

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* En-tête vert pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
            padding: '2rem',
            color: '#064E3B'
          }}>
            {/* Bouton retour conditionnel avec vue */}
              {(() => {
                if (typeof window !== 'undefined') {
                  const relectureState = sessionStorage.getItem('relecture-state');
                  if (relectureState) {
                    const state = JSON.parse(relectureState);
                    return (
                      <button
                        onClick={() => {
                          window.history.back();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#064E3B',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #A7F3D0',
                          background: '#F0FDF4',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          marginBottom: '1rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#D1FAE5';
                          e.currentTarget.style.borderColor = '#6EE7B7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F0FDF4';
                          e.currentTarget.style.borderColor = '#A7F3D0';
                        }}
                      >
                        <ArrowLeft size={20} />
                        Retour à la relecture
                        <span style={{
                          fontSize: '0.75rem',
                          opacity: 0.7,
                          marginLeft: '0.25rem'
                        }}>
                          ({state.viewLabel || 'Relecture'})
                        </span>
                      </button>
                    );
                  }
                }
                return <Link href="/ecritures" style={{
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
              Retour aux écritures
            </Link>;
              })()}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
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
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  📖
                </div>
                <div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {ecriture.reference}
                  </h1>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.8
                  }}>
                    {ecriture.traduction}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <Link
                  href={`/ecritures/${ecriture.id}/modifier`}
                  style={{
                    background: 'white',
                    color: '#064E3B',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  title="Modifier"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    background: 'white',
                    color: '#EF4444',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            {/* Texte biblique */}
            <div style={{
              background: '#F0FDF4',
              border: '2px solid #D1FAE5',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.8',
                color: '#1F2937',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic'
              }}>
                {ecriture.texte_complet}
              </p>
            </div>

            {/* Ce qui m'a touché */}
            {ecriture.ce_qui_ma_touche && (
              <div style={{
                background: '#FEF3C7',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#78350F'
                }}>
                  <Heart size={20} />
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Ce qui m'a touché
                  </h3>
                </div>
                <p style={{
                  color: '#92400E',
                  lineHeight: '1.6'
                }}>
                  {ecriture.ce_qui_ma_touche}
                </p>
              </div>
            )}

            {/* Métadonnées */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#F0FDF4',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#047857'
                }}>
                  <Calendar size={20} />
                  <span style={{ fontWeight: '500' }}>Date de réception</span>
                </div>
                <p style={{ color: '#064E3B', fontSize: '1.125rem' }}>
                  {format(new Date(ecriture.date_reception), 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <div style={{
                background: '#F0FDF4',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#047857'
                }}>
                  <Book size={20} />
                  <span style={{ fontWeight: '500' }}>Contexte</span>
                </div>
                <p style={{ color: '#064E3B', fontSize: '1.125rem' }}>
                  {contexteLabels[ecriture.contexte] || ecriture.contexte}
                </p>
              </div>

              <div style={{
                background: '#F0FDF4',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#047857'
                }}>
                  <User size={20} />
                  <span style={{ fontWeight: '500' }}>Pour</span>
                </div>
                <p style={{ color: '#064E3B', fontSize: '1.125rem' }}>
                  {ecriture.pour_qui || 'Moi'}
                </p>
              </div>
            </div>

            {/* Fruits spirituels */}
            {ecriture.fruits && ecriture.fruits.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#064E3B',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sparkles size={20} />
                  Fruits spirituels
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {ecriture.fruits.map(fruit => (
                    <span
                      key={fruit}
                      style={{
                        background: '#A7F3D0',
                        color: '#064E3B',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Tag size={14} />
                      {fruit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citation en bas */}
            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: '#F0FDF4',
              borderRadius: '0.75rem',
              textAlign: 'center',
              borderLeft: '4px solid #6EE7B7'
            }}>
              <p style={{
                fontSize: '1rem',
                color: '#064E3B',
                fontStyle: 'italic',
                marginBottom: '0.5rem'
              }}>
                « Ta parole est une lampe à mes pieds, une lumière sur ma route. »
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#047857'
              }}>
                Psaume 119, 105
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}