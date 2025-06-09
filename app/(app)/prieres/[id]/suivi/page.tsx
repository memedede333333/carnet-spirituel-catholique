'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, TrendingUp, MessageSquare, ArrowLeft, Plus, Heart, Users, HandHeart } from 'lucide-react'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom: string | null
  sujet: string
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

const evolutionOptions = [
  { value: 'amelioration', label: 'Amélioration', description: 'Les choses s\'améliorent progressivement' },
  { value: 'stable', label: 'Stable', description: 'La situation reste inchangée' },
  { value: 'aggravation', label: 'Aggravation', description: 'La situation se dégrade' },
  { value: 'gueri', label: 'Guéri', description: 'Guérison complète, Dieu soit loué !' },
  { value: 'guerison_partielle', label: 'Guérison partielle', description: 'Des progrès significatifs' },
  { value: 'paix', label: 'Paix reçue', description: 'Une paix intérieure malgré la situation' },
  { value: 'conversion', label: 'Conversion', description: 'Un changement de cœur s\'est opéré' },
  { value: 'reconciliation', label: 'Réconciliation', description: 'Les relations ont été restaurées' },
  { value: 'reponse_claire', label: 'Réponse claire', description: 'Dieu a répondu clairement' },
  { value: 'signe_encourageant', label: 'Signe encourageant', description: 'Des signes positifs apparaissent' },
  { value: 'dans_mystere', label: 'Dans le mystère', description: 'Nous restons dans la confiance' },
  { value: 'en_cours', label: 'En cours', description: 'La prière continue' }
]

export default function SuiviPrierePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [priere, setPriere] = useState<Priere | null>(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [evolution, setEvolution] = useState('')
  const [nouvellePriere, setNouvellePriere] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPriere()
  }, [resolvedParams.id])

  const fetchPriere = async () => {
    try {
      const { data, error } = await supabase
        .from('prieres')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setPriere(data)
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/prieres')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!notes.trim()) {
      setError('Veuillez décrire le suivi')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('suivis_priere')
        .insert({
          priere_id: resolvedParams.id,
          date,
          notes: notes.trim(),
          evolution: evolution || null,
          nouvelle_priere: nouvellePriere
        })

      if (error) throw error

      router.push(`/prieres/${resolvedParams.id}`)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Une erreur est survenue lors de l\'enregistrement')
    } finally {
      setSaving(false)
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
          {/* En-tête avec la couleur du type */}
          <div style={{
            background: colors.bg,
            borderBottom: `3px solid ${colors.border}`,
            padding: '2rem'
          }}>
            <Link href={`/prieres/${resolvedParams.id}`} style={{
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
              Retour à la prière
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
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
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  marginBottom: '0.25rem'
                }}>
                  Ajouter un suivi
                </h1>
                <p style={{
                  color: '#4B5563'
                }}>
                  {priere.personne_prenom} {priere.personne_nom || ''} - {priere.sujet}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                background: '#FEE2E2',
                color: '#991B1B',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Date du suivi */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                <Calendar size={20} />
                Date du suivi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
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

            {/* Notes de suivi */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                <MessageSquare size={20} />
                Notes de suivi
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comment la situation a-t-elle évolué ? Y a-t-il des signes de l'action de Dieu ?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BFDBFE'}
                onBlur={(e) => e.target.style.borderColor = '#DBEAFE'}
              />
            </div>

            {/* Évolution */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                <TrendingUp size={20} />
                Évolution (optionnel)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '0.75rem'
              }}>
                {evolutionOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: `2px solid ${evolution === option.value ? '#93C5FD' : '#E5E7EB'}`,
                      background: evolution === option.value ? '#F0F9FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <input
                        type="radio"
                        name="evolution"
                        value={option.value}
                        checked={evolution === option.value}
                        onChange={(e) => setEvolution(e.target.value)}
                        style={{ marginRight: '0.25rem' }}
                      />
                      <span style={{
                        fontWeight: '500',
                        color: evolution === option.value ? '#1E3A8A' : '#1F2937'
                      }}>
                        {option.label}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      marginTop: '0.25rem',
                      marginLeft: '1.5rem'
                    }}>
                      {option.description}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Nouvelle prière */}
            <div style={{
              marginBottom: '2rem',
              background: '#FEF3C7',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={nouvellePriere}
                  onChange={(e) => setNouvellePriere(e.target.checked)}
                  style={{ marginRight: '0.25rem' }}
                />
                <span style={{
                  fontWeight: '500',
                  color: '#78350F'
                }}>
                  Une nouvelle prière a été faite
                </span>
              </label>
              <p style={{
                fontSize: '0.875rem',
                color: '#92400E',
                marginTop: '0.5rem',
                marginLeft: '1.75rem'
              }}>
                Cochez si vous avez prié à nouveau pour cette intention lors de ce suivi
              </p>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Link
                href={`/prieres/${resolvedParams.id}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #BFDBFE',
                  color: '#1E3A8A',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  display: 'inline-block'
                }}
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  background: '#93C5FD',
                  color: '#1E3A8A',
                  border: 'none',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={20} />
                {saving ? 'Enregistrement...' : 'Ajouter le suivi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
