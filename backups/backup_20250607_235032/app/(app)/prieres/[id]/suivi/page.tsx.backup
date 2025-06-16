'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, MessageSquare, TrendingUp, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom?: string
  sujet: string
}

export default function SuiviPrierePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [priere, setPriere] = useState<Priere | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [evolution, setEvolution] = useState('')
  const [nouvellePriere, setNouvellePriere] = useState(false)

  useEffect(() => {
    fetchPriere()
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
        .select('id, type, personne_prenom, personne_nom, sujet')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) {
      setError('Les notes sont requises')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('suivis_priere')
        .insert({
          priere_id: resolvedParams.id,
          date: date,
          notes: notes.trim(),
          evolution: evolution === '' ? null : evolution,
          nouvelle_priere: nouvellePriere
        })

      if (error) throw error
      router.push(`/prieres/${resolvedParams.id}`)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de ajout du suivi')
    } finally {
      setSaving(false)
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

  const evolutionOptions = [
    { value: '', label: '💭 Aucune évolution particulière', icon: '💭' },
    { value: 'amelioration', label: '📈 Amélioration notable', icon: '📈' },
    { value: 'gueri', label: '✨ Guérison complète', icon: '✨' },
    { value: 'guerison_partielle', label: '🌱 Guérison partielle', icon: '🌱' },
    { value: 'stable', label: '⚖️ Situation stable', icon: '⚖️' },
    { value: 'paix', label: '🕊️ Paix profonde reçue', icon: '🕊️' },
    { value: 'conversion', label: '💛 Conversion du cœur', icon: '💛' },
    { value: 'reconciliation', label: '🤝 Réconciliation', icon: '🤝' },
    { value: 'reponse_claire', label: '💡 Réponse claire reçue', icon: '💡' },
    { value: 'signe_encourageant', label: '🌟 Signe encourageant', icon: '🌟' },
    { value: 'en_cours', label: '⏳ Évolution en cours', icon: '⏳' },
    { value: 'aggravation', label: '📉 Aggravation temporaire', icon: '📉' },
    { value: 'dans_mystere', label: '🙏 Dans le mystère de Dieu', icon: '🙏' }
  ]

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

  if (error && !priere) {
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
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/prieres/${resolvedParams.id}`} style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#6366f1',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour à la prière
          </Link>
        </div>

        {priere && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: getTypeColor(priere.type),
                color: 'white',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginRight: '1rem'
              }}>
                {priere.type}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Prière pour {priere.personne_prenom}{priere.personne_nom ? ` ${priere.personne_nom}` : ''}
              </h2>
            </div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>{priere.sujet}</p>
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>📝</div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Nouveau suivi
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Notez l'évolution de cette intention de prière
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                borderRadius: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ color: '#ef4444', marginRight: '0.75rem' }}>⚠️</div>
                  <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#10b981' }} />
                Date du suivi *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <MessageSquare style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#10b981' }} />
                Notes du suivi *
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  resize: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Décrivez en détail ce qui s'est passé : amélioration physique, paix intérieure, signe reçu, réponse à la prière, changement de situation, grâce particulière..."
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <TrendingUp style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#10b981' }} />
                Évolution spirituelle observée
              </label>
              <select
                value={evolution}
                onChange={(e) => setEvolution(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {evolutionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                <Plus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#10b981' }} />
                Nature du suivi
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${!nouvellePriere ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: !nouvellePriere ? 'rgba(16, 185, 129, 0.1)' : 'white'
                }}>
                  <input
                    type="radio"
                    checked={!nouvellePriere}
                    onChange={() => setNouvellePriere(false)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    border: '2px solid #10b981',
                    background: !nouvellePriere ? '#10b981' : 'white',
                    marginRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {!nouvellePriere && (
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: 'white'
                      }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                      📝 Suivi d'évolution
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Point d'étape sur la même intention
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${nouvellePriere ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: nouvellePriere ? 'rgba(59, 130, 246, 0.1)' : 'white'
                }}>
                  <input
                    type="radio"
                    checked={nouvellePriere}
                    onChange={() => setNouvellePriere(true)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    border: '2px solid #3b82f6',
                    background: nouvellePriere ? '#3b82f6' : 'white',
                    marginRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {nouvellePriere && (
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: 'white'
                      }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                      🆕 Nouvelle intention
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Nouvelle demande de prière
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href={`/prieres/${resolvedParams.id}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  color: '#374151',
                  background: '#f3f4f6',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#d1d5db' : '#10b981',
                  color: 'white',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: saving ? 0.5 : 1,
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.target.style.background = '#059669'
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.target.style.background = '#10b981'
                }}
              >
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {saving ? 'Enregistrement...' : 'Enregistrer le suivi'}
              </button>
            </div>
          </form>
        </div>

        <div style={{
          marginTop: '2rem',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'start' }}>
            <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>🌱</div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                Conseil spirituel
              </h3>
              <p style={{ color: '#065f46', lineHeight: '1.6', margin: 0 }}>
                "Persévérez dans la prière" (Col 4:2). Chaque suivi nous aide à reconnaître l'action de Dieu 
                et renforce notre foi dans la fidélité du Seigneur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
