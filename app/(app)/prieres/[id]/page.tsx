'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, MessageSquare, Hash, Edit, Trash2, Plus, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom?: string
  date: string
  sujet: string
  sujet_detail?: string
  nombre_fois: number
  notes?: string
  visibilite: string
  created_at: string
}

interface SuiviPriere {
  id: string
  date: string
  notes: string
  evolution?: string
  nouvelle_priere: boolean
  created_at: string
}

export default function DetailPrierePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [priere, setPriere] = useState<Priere | null>(null)
  const [suivis, setSuivis] = useState<SuiviPriere[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPriere()
    fetchSuivis()
  }, [resolvedParams.id])

  const fetchPriere = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('prieres')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setPriere(data)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Prière non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from('suivis_priere')
        .select('*')
        .eq('priere_id', resolvedParams.id)
        .order('date', { ascending: false })

      if (error) throw error
      setSuivis(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des suivis:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prière ?')) return

    try {
      const { error } = await supabase
        .from('prieres')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/prieres')
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de la suppression')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guerison': return '#ef4444'
      case 'freres': return '#3b82f6'
      case 'intercession': return '#8b5cf6'
      default: return '#6366f1'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'guerison': return 'Prière de guérison'
      case 'freres': return 'Prière des frères'
      case 'intercession': return 'Intercession'
      default: return type
    }
  }

  const getEvolutionLabel = (evolution: string) => {
    const evolutionLabels: { [key: string]: string } = {
      'amelioration': '📈 Amélioration notable',
      'stable': '⚖️ Situation stable',
      'aggravation': '📉 Aggravation temporaire',
      'gueri': '✨ Guérison complète',
      'guerison_partielle': '🌱 Guérison partielle',
      'paix': '🕊️ Paix profonde reçue',
      'conversion': '💛 Conversion du cœur',
      'reconciliation': '🤝 Réconciliation',
      'reponse_claire': '💡 Réponse claire reçue',
      'signe_encourageant': '🌟 Signe encourageant',
      'en_cours': '⏳ Évolution en cours',
      'dans_mystere': '🙏 Dans le mystère de Dieu'
    }
    return evolutionLabels[evolution] || evolution
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !priere) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/prieres" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#6366f1',
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour aux prières
          </Link>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Prière introuvable
            </h1>
            <p style={{ color: '#6b7280' }}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link href="/prieres" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#6366f1',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour aux prières
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href={`/prieres/${priere.id}/suivi`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                transition: 'background 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Ajouter un suivi
            </Link>
            <Link 
              href={`/prieres/${priere.id}/modifier`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                background: '#6366f1',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                transition: 'background 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <Edit style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <Trash2 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Supprimer
            </button>
          </div>
        </div>

        {/* Carte principale */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {/* En-tête de la carte */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>🙏</div>
              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: getTypeColor(priere.type),
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  {getTypeLabel(priere.type)}
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  {priere.personne_prenom}{priere.personne_nom ? ` ${priere.personne_nom}` : ''}
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Intention de prière
                </p>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            {/* Sujet principal */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Sujet de prière
              </h2>
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                borderLeft: '4px solid #6366f1'
              }}>
                <p style={{
                  color: '#1f2937',
                  lineHeight: '1.7',
                  fontSize: '1.125rem',
                  margin: 0
                }}>
                  {priere.sujet}
                </p>
              </div>
            </div>

            {/* Détails du sujet */}
            {priere.sujet_detail && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                  Détails
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {priere.sujet_detail}
                </p>
              </div>
            )}

            {/* Métadonnées */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Date</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {format(new Date(priere.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Hash style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Nombre de fois</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {priere.nombre_fois} fois
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Visibilité</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                    {priere.visibilite}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Créée le</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {format(new Date(priere.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {priere.notes && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                  Notes personnelles
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                  {priere.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Suivis */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Suivis de prière ({suivis.length})
              </h2>
              <Link
                href={`/prieres/${priere.id}/suivi`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Nouveau suivi
              </Link>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {suivis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Aucun suivi pour le moment
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                  Ajoutez un premier suivi pour noter l'évolution de cette prière
                </p>
                <Link
                  href={`/prieres/${priere.id}/suivi`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '0.75rem',
                    textDecoration: 'none'
                  }}
                >
                  <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  Premier suivi
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {suivis.map((suivi, index) => (
                  <div
                    key={suivi.id}
                    style={{
                      padding: '1rem',
                      background: index === 0 ? 'rgba(16, 185, 129, 0.1)' : '#f9fafb',
                      borderRadius: '0.75rem',
                      borderLeft: `4px solid ${index === 0 ? '#10b981' : '#e2e8f0'}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {format(new Date(suivi.date), 'dd MMMM yyyy', { locale: fr })}
                        {index === 0 && (
                          <span style={{
                            marginLeft: '0.5rem',
                            padding: '0.125rem 0.5rem',
                            background: '#10b981',
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '0.75rem'
                          }}>
                            Récent
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {suivi.nouvelle_priere && (
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '0.75rem'
                          }}>
                            Nouvelle intention
                          </span>
                        )}
                        {suivi.evolution && (
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            background: '#f59e0b',
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '0.75rem'
                          }}>
                            {getEvolutionLabel(suivi.evolution)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>
                      {suivi.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Citation spirituelle */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{
            color: '#6366f1',
            fontStyle: 'italic',
            fontSize: '1.125rem',
            margin: 0
          }}>
            "Priez sans cesse" - 1 Thessaloniciens 5:17
          </p>
        </div>
      </div>
    </div>
  )
}
