'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { HandHeart, Plus, Calendar, User, MessageCircle } from 'lucide-react'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom?: string
  date: string
  sujet: string
  nombre_fois: number
  notes?: string
  created_at: string
}

export default function PrieresPage() {
  const router = useRouter()
  const [prieres, setPrieres] = useState<Priere[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrieres()
  }, [])

  const loadPrieres = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('prieres')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
    } else {
      setPrieres(data || [])
    }
    setLoading(false)
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
      case 'guerison': return 'Guérison'
      case 'freres': return 'Prière des frères'
      case 'intercession': return 'Intercession'
      default: return type
    }
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
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement des prières...</p>
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
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '1rem',
              padding: '1rem',
              marginRight: '1rem'
            }}>
              <HandHeart style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                Prières
              </h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '1.125rem' }}>
                Suivez vos intentions de prière et leurs fruits
              </p>
            </div>
          </div>
          <Link
            href="/prieres/nouvelle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Plus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Nouvelle prière
          </Link>
        </div>

        {/* Liste des prières */}
        {prieres.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              Aucune prière enregistrée
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Commencez par ajouter votre première intention de prière
            </p>
            <Link
              href="/prieres/nouvelle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                background: '#6366f1',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              <Plus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Ajouter une prière
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {prieres.map((priere) => (
              <Link
                key={priere.id}
                href={`/prieres/${priere.id}`}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)'
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.1)'
                }}
              >
                {/* En-tête de la carte */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: getTypeColor(priere.type),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginBottom: '0.75rem'
                  }}>
                    {getTypeLabel(priere.type)}
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {priere.personne_prenom}{priere.personne_nom ? ` ${priere.personne_nom}` : ''}
                  </h3>
                </div>

                {/* Contenu */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{
                    color: '#475569',
                    lineHeight: '1.5',
                    margin: '0 0 0.75rem 0'
                  }}>
                    {priere.sujet}
                  </p>
                  
                  {priere.notes && (
                    <p style={{
                      color: '#64748b',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                      margin: 0
                    }}>
                      {priere.notes.length > 100 
                        ? `${priere.notes.substring(0, 100)}...` 
                        : priere.notes
                      }
                    </p>
                  )}
                </div>

                {/* Métadonnées */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                    {format(new Date(priere.date), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HandHeart style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                    {priere.nombre_fois} fois
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Citation spirituelle */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
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
