'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Calendar, MapPin, Tag, Eye, Share2, Edit, Trash2, ArrowLeft, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Grace {
  id: string
  texte: string
  date: string
  lieu: string | null
  tags: string[]
  visibilite: string
  statut_partage: string
  created_at: string
}

export default function GraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [grace, setGrace] = useState<Grace | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchGrace()
  }, [resolvedParams.id])

  const fetchGrace = async () => {
    try {
      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setGrace(data)
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/graces')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette grâce ?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('graces')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/graces')
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>✨</div>
          <p style={{ color: '#78350F' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!grace) return null

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
          {/* En-tête jaune pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            padding: '2rem',
            color: '#78350F'
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
                return <Link href="/graces" style={{
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
              Retour aux grâces
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
                  background: '#FCD34D',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={28} style={{ color: '#78350F' }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    Grâce reçue
                  </h1>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.8
                  }}>
                    {format(new Date(grace.created_at), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <Link
                  href={`/graces/${grace.id}/modifier`}
                  style={{
                    background: 'white',
                    color: '#78350F',
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
            {/* Texte principal */}
            <div style={{
              background: '#FFFEF7',
              border: '2px solid #FEF3C7',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.8',
                color: '#1F2937',
                fontStyle: 'italic'
              }}>
                « {grace.texte} »
              </p>
            </div>

            {/* Métadonnées */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#FEF3C7',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#92400E'
                }}>
                  <Calendar size={20} />
                  <span style={{ fontWeight: '500' }}>Date</span>
                </div>
                <p style={{ color: '#78350F', fontSize: '1.125rem' }}>
                  {format(new Date(grace.date), 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              {grace.lieu && (
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '0.75rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: '#92400E'
                  }}>
                    <MapPin size={20} />
                    <span style={{ fontWeight: '500' }}>Lieu</span>
                  </div>
                  <p style={{ color: '#78350F', fontSize: '1.125rem' }}>
                    {grace.lieu}
                  </p>
                </div>
              )}

              <div style={{
                background: '#FEF3C7',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#92400E'
                }}>
                  <Eye size={20} />
                  <span style={{ fontWeight: '500' }}>Visibilité</span>
                </div>
                <p style={{ color: '#78350F', fontSize: '1.125rem' }}>
                  {grace.visibilite === 'prive' ? 'Privé' :
                   grace.visibilite === 'anonyme' ? 'Anonyme' : 'Public'}
                </p>
              </div>

              {grace.statut_partage !== 'brouillon' && (
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '0.75rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: '#92400E'
                  }}>
                    <Share2 size={20} />
                    <span style={{ fontWeight: '500' }}>Partage</span>
                  </div>
                  <p style={{ 
                    color: grace.statut_partage === 'approuve' ? '#059669' : '#78350F',
                    fontSize: '1.125rem',
                    fontWeight: grace.statut_partage === 'approuve' ? '600' : '400'
                  }}>
                    {grace.statut_partage === 'propose' ? 'Proposé au partage' :
                     grace.statut_partage === 'approuve' ? 'Partagé avec la communauté' : 'Refusé'}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {grace.tags && grace.tags.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#78350F',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Tag size={20} />
                  Tags
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {grace.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#FDE68A',
                        color: '#78350F',
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
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions de partage si privé */}
            {grace.visibilite !== 'prive' && grace.statut_partage === 'brouillon' && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: '#FEF3C7',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#92400E',
                  marginBottom: '1rem'
                }}>
                  Cette grâce peut être partagée pour édifier la communauté
                </p>
                <button
                  style={{
                    background: '#FCD34D',
                    color: '#78350F',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Share2 size={20} />
                  Proposer au partage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
