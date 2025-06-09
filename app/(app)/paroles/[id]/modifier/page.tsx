'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, MessageSquare, Users, MapPin, CheckCircle, ArrowLeft, Save, Sparkles } from 'lucide-react'

interface Parole {
  id: string
  texte: string
  date: string
  contexte: string
  contexte_detail: string | null
  destinataire: string
  personne_destinataire: string | null
  fruit_constate: string | null
  date_accomplissement: string | null
}

export default function ModifierParolePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [parole, setParole] = useState<Parole | null>(null)
  const [texte, setTexte] = useState('')
  const [date, setDate] = useState('')
  const [contexte, setContexte] = useState<'personnelle' | 'veillee' | 'mission' | 'priere' | 'autre'>('personnelle')
  const [contexteDetail, setContexteDetail] = useState('')
  const [destinataire, setDestinataire] = useState<'moi' | 'inconnu' | 'personne'>('inconnu')
  const [personneDestinataire, setPersonneDestinataire] = useState('')
  const [fruitConstate, setFruitConstate] = useState('')
  const [isAccomplie, setIsAccomplie] = useState(false)
  const [dateAccomplissement, setDateAccomplissement] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const contexteOptions = [
    { value: 'personnelle', label: 'Personnelle' },
    { value: 'veillee', label: 'Veillée' },
    { value: 'mission', label: 'Mission' },
    { value: 'priere', label: 'Prière' },
    { value: 'autre', label: 'Autre' }
  ]

  const destinataireOptions = [
    { value: 'moi', label: 'Pour moi' },
    { value: 'inconnu', label: 'Destinataire inconnu' },
    { value: 'personne', label: 'Pour quelqu\'un' }
  ]

  useEffect(() => {
    fetchParole()
  }, [resolvedParams.id])

  const fetchParole = async () => {
    try {
      const { data, error } = await supabase
        .from('paroles_connaissance')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      
      setParole(data)
      setTexte(data.texte)
      setDate(data.date)
      setContexte(data.contexte)
      setContexteDetail(data.contexte_detail || '')
      setDestinataire(data.destinataire)
      setPersonneDestinataire(data.personne_destinataire || '')
      setFruitConstate(data.fruit_constate || '')
      setIsAccomplie(!!data.date_accomplissement)
      setDateAccomplissement(data.date_accomplissement || new Date().toISOString().split('T')[0])
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/paroles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!texte.trim()) {
      setError('Veuillez saisir la parole reçue')
      return
    }

    if (destinataire === 'personne' && !personneDestinataire.trim()) {
      setError('Veuillez indiquer le nom du destinataire')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('paroles_connaissance')
        .update({
          texte: texte.trim(),
          date,
          contexte,
          contexte_detail: contexteDetail.trim() || null,
          destinataire,
          personne_destinataire: destinataire === 'personne' ? personneDestinataire.trim() : null,
          fruit_constate: fruitConstate.trim() || null,
          date_accomplissement: isAccomplie ? dateAccomplissement : null
        })
        .eq('id', resolvedParams.id)

      if (error) throw error

      router.push(`/paroles/${resolvedParams.id}`)
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🕊️</div>
          <p style={{ color: '#075985' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!parole) return null

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
          {/* En-tête bleu ciel pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
            padding: '2rem',
            color: '#075985'
          }}>
            <Link href={`/paroles/${resolvedParams.id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#075985',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}>
              <ArrowLeft size={16} />
              Retour à la parole
            </Link>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <MessageSquare size={32} />
              Modifier la parole
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

            {/* Texte de la parole */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#075985'
              }}>
                Parole reçue
              </label>
              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0F2FE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
              />
            </div>

            {/* Date */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#075985'
              }}>
                <Calendar size={20} />
                Date de réception
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0F2FE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
              />
            </div>

            {/* Contexte */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontWeight: '500',
                color: '#075985'
              }}>
                <MapPin size={20} />
                Contexte de réception
              </label>
              <select
                value={contexte}
                onChange={(e) => setContexte(e.target.value as typeof contexte)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0F2FE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
              >
                {contexteOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {contexte === 'autre' && (
                <input
                  type="text"
                  value={contexteDetail}
                  onChange={(e) => setContexteDetail(e.target.value)}
                  placeholder="Précisez le contexte..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E0F2FE',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0F9FF',
                    marginTop: '0.75rem'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                  onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
                />
              )}
            </div>

            {/* Destinataire */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontWeight: '500',
                color: '#075985'
              }}>
                <Users size={20} />
                Destinataire
              </label>
              <select
                value={destinataire}
                onChange={(e) => setDestinataire(e.target.value as typeof destinataire)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0F2FE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
              >
                {destinataireOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {destinataire === 'personne' && (
                <input
                  type="text"
                  value={personneDestinataire}
                  onChange={(e) => setPersonneDestinataire(e.target.value)}
                  placeholder="Nom de la personne..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E0F2FE',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0F9FF',
                    marginTop: '0.75rem'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                  onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
                />
              )}
            </div>

            {/* Section accomplissement */}
            <div style={{
              background: '#F0F9FF',
              border: '2px solid #E0F2FE',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#075985',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Sparkles size={20} />
                Accomplissement de la parole
              </h3>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={isAccomplie}
                  onChange={(e) => setIsAccomplie(e.target.checked)}
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ color: '#075985' }}>
                  Cette parole s'est accomplie
                </span>
              </label>

              {isAccomplie && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#075985'
                    }}>
                      <CheckCircle size={20} />
                      Date d'accomplissement
                    </label>
                    <input
                      type="date"
                      value={dateAccomplissement}
                      onChange={(e) => setDateAccomplissement(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E0F2FE',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                      onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#075985'
                    }}>
                      Fruit constaté (optionnel)
                    </label>
                    <textarea
                      value={fruitConstate}
                      onChange={(e) => setFruitConstate(e.target.value)}
                      placeholder="Décrivez comment cette parole s'est réalisée..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E0F2FE',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#BAE6FD'}
                      onBlur={(e) => e.target.style.borderColor = '#E0F2FE'}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Link
                href={`/paroles/${resolvedParams.id}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #BAE6FD',
                  color: '#075985',
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
                  background: '#7DD3FC',
                  color: '#075985',
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