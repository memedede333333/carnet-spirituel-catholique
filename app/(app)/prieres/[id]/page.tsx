'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Calendar, User, Heart, Users, HandHeart, Edit, Trash2, ArrowLeft, Plus, Clock, TrendingUp, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
}

interface Suivi {
  id: string
  date: string
  notes: string
  evolution: string | null
  nouvelle_priere: boolean
  created_at: string
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

const evolutionLabels: Record<string, { label: string; color: string }> = {
  amelioration: { label: 'Amélioration', color: '#059669' },
  stable: { label: 'Stable', color: '#D97706' },
  aggravation: { label: 'Aggravation', color: '#DC2626' },
  gueri: { label: 'Guéri', color: '#059669' },
  guerison_partielle: { label: 'Guérison partielle', color: '#10B981' },
  paix: { label: 'Paix reçue', color: '#8B5CF6' },
  conversion: { label: 'Conversion', color: '#EC4899' },
  reconciliation: { label: 'Réconciliation', color: '#F59E0B' },
  reponse_claire: { label: 'Réponse claire', color: '#3B82F6' },
  signe_encourageant: { label: 'Signe encourageant', color: '#10B981' },
  dans_mystere: { label: 'Dans le mystère', color: '#6B7280' },
  en_cours: { label: 'En cours', color: '#6366F1' }
}

export default function PriereDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [priere, setPriere] = useState<Priere | null>(null)
  const [suivis, setSuivis] = useState<Suivi[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPriere()
  }, [resolvedParams.id])

  const fetchPriere = async () => {
    try {
      const { data: priereData, error: priereError } = await supabase
        .from('prieres')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (priereError) throw priereError
      setPriere(priereData)

      const { data: suivisData, error: suivisError } = await supabase
        .from('suivis_priere')
        .select('*')
        .eq('priere_id', resolvedParams.id)
        .order('date', { ascending: false })

      if (suivisError) throw suivisError
      setSuivis(suivisData || [])
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/prieres')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prière et tous ses suivis ?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('prieres')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/prieres')
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
          <p style={{ color: '#1E3A8A' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!priere) return null

  const TypeIcon = typeLabels[priere.type].icon
  const colors = typeColors[priere.type]
  const latestSuivi = suivis[0]

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* En-tête coloré selon le type */}
          <div style={{
            background: colors.bg,
            borderBottom: `3px solid ${colors.border}`,
            padding: '2rem'
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
                          color: '#7BA7E1',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #E6EDFF',
                          background: '#F0F4FF',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E6EDFF';
                          e.currentTarget.style.borderColor = '#7BA7E1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F0F4FF';
                          e.currentTarget.style.borderColor = '#E6EDFF';
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
                return <Link href="/prieres" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: colors.text,
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}>
              <ArrowLeft size={16} />
              Retour aux prières
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
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <div style={{
                  background: colors.light,
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TypeIcon size={28} style={{ color: colors.text }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: colors.text,
                    opacity: 0.8,
                    marginBottom: '0.25rem'
                  }}>
                    {typeLabels[priere.type].label}
                  </p>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: '0.5rem'
                  }}>
                    {priere.personne_prenom} {priere.personne_nom || ''}
                  </h1>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#4B5563'
                  }}>
                    {priere.sujet}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <Link
                  href={`/prieres/${priere.id}/modifier`}
                  style={{
                    background: 'white',
                    color: colors.text,
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
            {/* Détails de la prière */}
            {priere.sujet_detail && (
              <div style={{
                background: '#F9FAFB',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#6B7280',
                  marginBottom: '0.5rem'
                }}>
                  Détails
                </h3>
                <p style={{
                  color: '#1F2937',
                  lineHeight: '1.6'
                }}>
                  {priere.sujet_detail}
                </p>
              </div>
            )}

            {/* Informations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#F0F9FF',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#0369A1'
                }}>
                  <Calendar size={20} />
                  <span style={{ fontWeight: '500' }}>Début de la prière</span>
                </div>
                <p style={{ color: '#1E40AF', fontSize: '1.125rem' }}>
                  {format(new Date(priere.date), 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <div style={{
                background: '#F0F9FF',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#0369A1'
                }}>
                  <Clock size={20} />
                  <span style={{ fontWeight: '500' }}>Nombre de fois</span>
                </div>
                <p style={{ color: '#1E40AF', fontSize: '1.125rem' }}>
                  {priere.nombre_fois} fois priées
                </p>
              </div>

              {latestSuivi && latestSuivi.evolution && (
                <div style={{
                  background: evolutionLabels[latestSuivi.evolution].color + '20',
                  borderRadius: '0.75rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: evolutionLabels[latestSuivi.evolution].color
                  }}>
                    <TrendingUp size={20} />
                    <span style={{ fontWeight: '500' }}>Dernière évolution</span>
                  </div>
                  <p style={{ 
                    color: evolutionLabels[latestSuivi.evolution].color,
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {evolutionLabels[latestSuivi.evolution].label}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {priere.notes && (
              <div style={{
                background: '#FEF3C7',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#92400E',
                  marginBottom: '0.5rem'
                }}>
                  Notes
                </h3>
                <p style={{
                  color: '#78350F',
                  lineHeight: '1.6'
                }}>
                  {priere.notes}
                </p>
              </div>
            )}

            {/* Section des suivis */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1F2937'
                }}>
                  Suivis de prière ({suivis.length})
                </h2>
                <Link
                  href={`/prieres/${priere.id}/suivi`}
                  style={{
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
                  }}
                >
                  <Plus size={20} />
                  Ajouter un suivi
                </Link>
              </div>

              {suivis.length === 0 ? (
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#6B7280' }}>
                    Aucun suivi enregistré pour cette prière
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {suivis.map((suivi, index) => (
                    <div
                      key={suivi.id}
                      style={{
                        background: 'white',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            marginBottom: '0.25rem'
                          }}>
                            {format(new Date(suivi.date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </p>
                          {suivi.evolution && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: evolutionLabels[suivi.evolution].color + '20',
                              color: evolutionLabels[suivi.evolution].color,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '1rem',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {(suivi.evolution === 'gueri' || suivi.evolution === 'guerison_partielle') && 
                                <CheckCircle size={14} />
                              }
                              {evolutionLabels[suivi.evolution].label}
                            </span>
                          )}
                        </div>
                        {suivi.nouvelle_priere && (
                          <span style={{
                            background: '#E0E7FF',
                            color: '#3730A3',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            Nouvelle prière
                          </span>
                        )}
                      </div>
                      <p style={{
                        color: '#374151',
                        lineHeight: '1.6'
                      }}>
                        {suivi.notes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}