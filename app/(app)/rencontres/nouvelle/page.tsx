'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, MapPin, User, Users, Heart, ArrowLeft, Plus, Info } from 'lucide-react'

export default function NouvelleRencontrePage() {
  const router = useRouter()
  const [personnePrenom, setPersonnePrenom] = useState('')
  const [personneNom, setPersonneNom] = useState('')
  const [lieu, setLieu] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [contexte, setContexte] = useState('rue')
  const [description, setDescription] = useState('')
  const [fruitImmediat, setFruitImmediat] = useState('')
  const [fruitEspere, setFruitEspere] = useState('')
  const [visibilite, setVisibilite] = useState<'prive' | 'anonyme' | 'public'>('prive')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const contexteOptions = [
    { value: 'rue', label: 'Dans la rue', icon: '🚶' },
    { value: 'paroisse', label: 'À la paroisse', icon: '⛪' },
    { value: 'mission', label: 'En mission', icon: '✝️' },
    { value: 'travail', label: 'Au travail', icon: '💼' },
    { value: 'quotidien', label: 'Vie quotidienne', icon: '🏠' },
    { value: 'autre', label: 'Autre', icon: '📍' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!personnePrenom.trim()) {
      setError('Veuillez indiquer le prénom de la personne')
      return
    }

    if (!lieu.trim()) {
      setError('Veuillez indiquer le lieu de la rencontre')
      return
    }

    if (!description.trim()) {
      setError('Veuillez décrire la rencontre')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('rencontres_missionnaires')
        .insert({
          user_id: user.id,
          personne_prenom: personnePrenom.trim(),
          personne_nom: personneNom.trim() || null,
          lieu: lieu.trim(),
          date,
          contexte,
          description: description.trim(),
          fruit_immediat: fruitImmediat.trim() || null,
          fruit_espere: fruitEspere.trim() || null,
          visibilite
        })

      if (error) throw error

      router.push('/rencontres')
    } catch (error) {
      console.error('Erreur:', error)
      setError('Une erreur est survenue lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

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
          {/* En-tête rose pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #FED7AA, #FDBA74)',
            padding: '2rem',
            color: '#451A03'
          }}>
            <Link href="/rencontres" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#451A03',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}>
              <ArrowLeft size={16} />
              Retour aux rencontres
            </Link>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
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
                boxShadow: '0 2px 4px rgba(198, 93, 0, 0.2)'
              }}>
                🤝
              </div>
              Nouvelle rencontre missionnaire
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

            {/* Personne rencontrée */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#451A03'
              }}>
                <User size={20} />
                Personne rencontrée
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <input
                  type="text"
                  value={personnePrenom}
                  onChange={(e) => setPersonnePrenom(e.target.value)}
                  placeholder="Prénom *"
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #FED7AA',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#FFF7ED',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                  onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
                />
                <input
                  type="text"
                  value={personneNom}
                  onChange={(e) => setPersonneNom(e.target.value)}
                  placeholder="Nom (optionnel)"
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #FED7AA',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#FFF7ED',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                  onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
                />
              </div>
            </div>

            {/* Lieu et date */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#451A03'
                }}>
                  <MapPin size={20} />
                  Lieu de la rencontre
                </label>
                <input
                  type="text"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  placeholder="Ex: Place de la République, métro..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #FED7AA',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#FFF7ED',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                  onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#451A03'
                }}>
                  <Calendar size={20} />
                  Date de la rencontre
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #FED7AA',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#FFF7ED',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                  onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
                />
              </div>
            </div>

            {/* Contexte */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '500',
                color: '#451A03'
              }}>
                Contexte de la rencontre
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '0.75rem'
              }}>
                {contexteOptions.map(option => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${contexte === option.value ? '#FDBA74' : '#E5E7EB'}`,
                      background: contexte === option.value ? '#FFF7ED' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (contexte !== option.value) {
                        e.currentTarget.style.borderColor = '#FED7AA'
                        e.currentTarget.style.background = '#FFF7ED'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (contexte !== option.value) {
                        e.currentTarget.style.borderColor = '#E5E7EB'
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="contexte"
                      value={option.value}
                      checked={contexte === option.value}
                      onChange={(e) => setContexte(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {option.icon}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      color: contexte === option.value ? '#451A03' : '#4B5563'
                    }}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#451A03'
              }}>
                Description de la rencontre
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comment s'est passée cette rencontre ? Qu'avez-vous échangé ?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #FED7AA',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#FFF7ED',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FDBA74'}
                onBlur={(e) => e.target.style.borderColor = '#FED7AA'}
              />
            </div>

            {/* Fruits */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#451A03'
                }}>
                  <Heart size={20} />
                  Fruit immédiat (optionnel)
                </label>
                <textarea
                  value={fruitImmediat}
                  onChange={(e) => setFruitImmediat(e.target.value)}
                  placeholder="Joie, conversion, réconciliation..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #FEF3C7',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#FFFBEB',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FDE047'}
                  onBlur={(e) => e.target.style.borderColor = '#FEF3C7'}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#451A03'
                }}>
                  <Heart size={20} />
                  Fruit espéré (optionnel)
                </label>
                <textarea
                  value={fruitEspere}
                  onChange={(e) => setFruitEspere(e.target.value)}
                  placeholder="Que souhaitez-vous pour cette personne ?"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E0E7FF',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#F0F4FF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#93C5FD'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E7FF'}
                />
              </div>
            </div>

            {/* Message d'encouragement */}
            <div style={{
              background: '#FFF5F7',
              border: '1px solid #FBCFE8',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '2rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <Info size={20} style={{ color: '#831843', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#831843' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  « Allez dans le monde entier. Proclamez l'Évangile à toute la création. » (Marc 16, 15)
                </p>
                <p>
                  Chaque rencontre est une occasion de témoigner de l'amour du Christ.
                </p>
              </div>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Link
                href="/rencontres"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #FED7AA',
                  color: '#451A03',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF7ED'
                  e.currentTarget.style.borderColor = '#FDBA74'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.borderColor = '#FED7AA'
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
                  background: '#C65D00',
                  color: 'white',
                  border: 'none',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.backgroundColor = '#D97706'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.currentTarget.style.backgroundColor = '#C65D00'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Plus size={20} />
                {saving ? 'Enregistrement...' : 'Enregistrer la rencontre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}