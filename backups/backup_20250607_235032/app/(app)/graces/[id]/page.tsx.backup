'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Tag, Eye, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Grace {
  id: string
  texte: string
  date: string
  lieu: string | null
  tags: string[]
  visibilite: string
  created_at: string
}

export default function DetailGracePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [grace, setGrace] = useState<Grace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchGrace()
  }, [resolvedParams.id])

  const fetchGrace = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setGrace(data)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Grâce non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette grâce ?')) return

    try {
      const { error } = await supabase
        .from('graces')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/graces')
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
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

  if (error || !grace) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/graces" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#f59e0b',
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour aux grâces
          </Link>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😇</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Grâce introuvable
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
      background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
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
          <Link href="/graces" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#f59e0b',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour aux grâces
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link 
              href={`/graces/${grace.id}/modifier`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                background: '#f59e0b',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                transition: 'background 0.2s'
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
                transition: 'background 0.2s'
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
          overflow: 'hidden'
        }}>
          {/* En-tête de la carte */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>✨</div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Grâce reçue
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Gardez mémoire des merveilles de Dieu
                </p>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            {/* Texte principal */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Grâce reçue
              </h2>
              <div style={{
                background: '#fef7ed',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                borderLeft: '4px solid #f59e0b'
              }}>
                <p style={{
                  color: '#1f2937',
                  lineHeight: '1.7',
                  fontSize: '1.125rem',
                  margin: 0
                }}>
                  {grace.texte}
                </p>
              </div>
            </div>

            {/* Métadonnées */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Date</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {format(new Date(grace.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              {/* Lieu */}
              {grace.lieu && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.75rem'
                }}>
                  <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginRight: '0.75rem' }} />
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Lieu</p>
                    <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>{grace.lieu}</p>
                  </div>
                </div>
              )}

              {/* Visibilité */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Visibilité</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                    {grace.visibilite}
                  </p>
                </div>
              </div>

              {/* Date de création */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginRight: '0.75rem' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Créée le</p>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {format(new Date(grace.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {grace.tags && grace.tags.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <Tag style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', marginRight: '0.5rem' }} />
                  <h3 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>Étiquettes</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {grace.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Citation spirituelle */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{
            color: '#f59e0b',
            fontStyle: 'italic',
            fontSize: '1.125rem',
            margin: 0
          }}>
            "Que notre cœur se tourne vers le Seigneur" - Saint Augustin
          </p>
        </div>
      </div>
    </div>
  )
}
