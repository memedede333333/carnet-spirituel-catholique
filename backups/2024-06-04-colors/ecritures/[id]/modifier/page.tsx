'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, Book, Heart, User, Sparkles, ArrowLeft, Save } from 'lucide-react'

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
}

export default function ModifierEcriturePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [ecriture, setEcriture] = useState<Ecriture | null>(null)
  const [reference, setReference] = useState('')
  const [texteComplet, setTexteComplet] = useState('')
  const [traduction, setTraduction] = useState('')
  const [contexte, setContexte] = useState<'messe' | 'lectio' | 'retraite' | 'groupe' | 'personnel'>('personnel')
  const [dateReception, setDateReception] = useState('')
  const [ceQuiMaTouche, setCeQuiMaTouche] = useState('')
  const [pourQui, setPourQui] = useState('')
  const [fruits, setFruits] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const contexteOptions = [
    { value: 'messe', label: 'Messe' },
    { value: 'lectio', label: 'Lectio Divina' },
    { value: 'retraite', label: 'Retraite' },
    { value: 'groupe', label: 'Groupe de prière' },
    { value: 'personnel', label: 'Personnel' }
  ]

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
      setReference(data.reference)
      setTexteComplet(data.texte_complet)
      setTraduction(data.traduction)
      setContexte(data.contexte)
      setDateReception(data.date_reception)
      setCeQuiMaTouche(data.ce_qui_ma_touche || '')
      setPourQui(data.pour_qui || 'moi')
      setFruits(data.fruits ? data.fruits.join(', ') : '')
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/ecritures')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reference.trim()) {
      setError('Veuillez indiquer la référence biblique')
      return
    }

    if (!texteComplet.trim()) {
      setError('Veuillez saisir le texte biblique')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('paroles_ecriture')
        .update({
          reference: reference.trim(),
          texte_complet: texteComplet.trim(),
          traduction: traduction.trim(),
          contexte,
          date_reception: dateReception,
          ce_qui_ma_touche: ceQuiMaTouche.trim() || null,
          pour_qui: pourQui.trim() || 'moi',
          fruits: fruits ? fruits.split(',').map(f => f.trim()).filter(f => f) : []
        })
        .eq('id', resolvedParams.id)

      if (error) throw error

      router.push(`/ecritures/${resolvedParams.id}`)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Une erreur est survenue lors de la modification')
    } finally {
      setSaving(false)
    }
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>📖</div>
          <p style={{ color: '#064E3B' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!ecriture) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
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
            <Link href={`/ecritures/${resolvedParams.id}`} style={{
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
              Retour au passage
            </Link>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Book size={32} />
              Modifier le passage
            </h1>
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

            {/* Référence et traduction */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  Référence biblique
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  Traduction
                </label>
                <input
                  type="text"
                  value={traduction}
                  onChange={(e) => setTraduction(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                />
              </div>
            </div>

            {/* Texte complet */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#064E3B'
              }}>
                Texte biblique
              </label>
              <textarea
                value={texteComplet}
                onChange={(e) => setTexteComplet(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #D1FAE5',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0FDF4',
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.6'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
              />
            </div>

            {/* Contexte et date */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  Contexte de réception
                </label>
                <select
                  value={contexte}
                  onChange={(e) => setContexte(e.target.value as typeof contexte)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                >
                  {contexteOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  <Calendar size={20} />
                  Date de réception
                </label>
                <input
                  type="date"
                  value={dateReception}
                  onChange={(e) => setDateReception(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                />
              </div>
            </div>

            {/* Ce qui m'a touché */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#064E3B'
              }}>
                <Heart size={20} />
                Ce qui m'a touché (optionnel)
              </label>
              <textarea
                value={ceQuiMaTouche}
                onChange={(e) => setCeQuiMaTouche(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #D1FAE5',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0FDF4'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
              />
            </div>

            {/* Pour qui et fruits */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  <User size={20} />
                  Pour qui ? (optionnel)
                </label>
                <input
                  type="text"
                  value={pourQui}
                  onChange={(e) => setPourQui(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#064E3B'
                }}>
                  <Sparkles size={20} />
                  Fruits spirituels (optionnel)
                </label>
                <input
                  type="text"
                  value={fruits}
                  onChange={(e) => setFruits(e.target.value)}
                  placeholder="Séparez par des virgules"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #D1FAE5',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0FDF4'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A7F3D0'}
                  onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
                />
              </div>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Link
                href={`/ecritures/${resolvedParams.id}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #A7F3D0',
                  color: '#064E3B',
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
                  background: '#6EE7B7',
                  color: '#064E3B',
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
                <Save size={20} />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}