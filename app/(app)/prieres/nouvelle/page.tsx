'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, HandHeart, User, Calendar, MessageSquare, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NouvellePrierePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // États du formulaire
  const [type, setType] = useState<'guerison' | 'freres' | 'intercession'>('guerison')
  const [personnePrenom, setPersonnePrenom] = useState('')
  const [personneNom, setPersonneNom] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [sujet, setSujet] = useState('')
  const [sujetDetail, setSujetDetail] = useState('')
  const [nombreFois, setNombreFois] = useState(1)
  const [notes, setNotes] = useState('')
  const [visibilite, setVisibilite] = useState('prive') // Correction: 'prive' au lieu de 'privee'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personnePrenom.trim() || !sujet.trim()) {
      setError('Le prénom et le sujet de prière sont requis')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('prieres')
        .insert({
          user_id: user.id,
          type,
          personne_prenom: personnePrenom.trim(),
          personne_nom: personneNom.trim() || null,
          date,
          sujet: sujet.trim(),
          sujet_detail: sujetDetail.trim() || null,
          nombre_fois: nombreFois,
          notes: notes.trim() || null,
          visibilite // Maintenant utilise 'prive' 
        })

      if (error) {
        console.error('Erreur Supabase:', error)
        throw error
      }
      router.push('/prieres')
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de l\'ajout de la prière')
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (typeValue: string) => {
    switch (typeValue) {
      case 'guerison': return '#ef4444'
      case 'freres': return '#3b82f6'
      case 'intercession': return '#8b5cf6'
      default: return '#6366f1'
    }
  }

  const getTypeLabel = (typeValue: string) => {
    switch (typeValue) {
      case 'guerison': return 'Prière de guérison'
      case 'freres': return 'Prière des frères'
      case 'intercession': return 'Intercession'
      default: return typeValue
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec navigation */}
        <div style={{ marginBottom: '2rem' }}>
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
        </div>

        {/* Formulaire */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
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
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Nouvelle prière
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Confiez vos intentions au Seigneur
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
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

            {/* Type de prière */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                <HandHeart style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Type de prière *
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {['guerison', 'freres', 'intercession'].map((typeValue) => (
                  <label
                    key={typeValue}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: `2px solid ${type === typeValue ? getTypeColor(typeValue) : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: type === typeValue ? `${getTypeColor(typeValue)}15` : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={typeValue}
                      checked={type === typeValue}
                      onChange={(e) => setType(e.target.value as any)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      border: `2px solid ${getTypeColor(typeValue)}`,
                      background: type === typeValue ? getTypeColor(typeValue) : 'white',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {type === typeValue && (
                        <div style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          background: 'white'
                        }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#374151' }}>
                        {getTypeLabel(typeValue)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {typeValue === 'guerison' && 'Pour la santé physique ou spirituelle'}
                        {typeValue === 'freres' && 'Pour la communauté et l\'Église'}
                        {typeValue === 'intercession' && 'Pour des intentions particulières'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Informations sur la personne */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  <User style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                  Prénom *
                </label>
                <input
                  type="text"
                  value={personnePrenom}
                  onChange={(e) => setPersonnePrenom(e.target.value)}
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
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="Prénom de la personne"
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  <User style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                  Nom (optionnel)
                </label>
                <input
                  type="text"
                  value={personneNom}
                  onChange={(e) => setPersonneNom(e.target.value)}
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
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="Nom de famille"
                />
              </div>
            </div>

            {/* Date et nombre de fois */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.75rem'
                }}>
                  <Hash style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                  Nombre de fois
                </label>
                <input
                  type="number"
                  min="1"
                  value={nombreFois}
                  onChange={(e) => setNombreFois(parseInt(e.target.value) || 1)}
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
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Sujet principal */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <MessageSquare style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Sujet de prière *
              </label>
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
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
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Ex: Guérison du cancer, conversion, paix familiale..."
                required
              />
            </div>

            {/* Détails du sujet */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <MessageSquare style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Détails (optionnel)
              </label>
              <textarea
                value={sujetDetail}
                onChange={(e) => setSujetDetail(e.target.value)}
                rows={3}
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
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Contexte, précisions sur la situation..."
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <MessageSquare style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Notes personnelles (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
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
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Vos réflexions, inspirations reçues..."
              />
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link
                href="/prieres"
                style={{
                  padding: '0.75rem 1.5rem',
                  color: '#374151',
                  background: '#f3f4f6',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#d1d5db' : '#6366f1',
                  color: 'white',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.background = '#4f46e5'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.background = '#6366f1'
                }}
              >
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {loading ? 'Enregistrement...' : 'Enregistrer la prière'}
              </button>
            </div>
          </form>
        </div>

        {/* Message d'encouragement */}
        <div style={{
          marginTop: '2rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem',
          borderLeft: '4px solid #6366f1'
        }}>
          <div style={{ display: 'flex', alignItems: 'start' }}>
            <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💙</div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#4338ca', marginBottom: '0.5rem' }}>
                Conseil spirituel
              </h3>
              <p style={{ color: '#4338ca', lineHeight: '1.6', margin: 0 }}>
                "La prière du juste a une grande efficacité" (Jacques 5:16). 
                Chaque intention confiée au Seigneur porte du fruit selon sa volonté divine.
              </p>
            </div>
          </div>
        </div>

        {/* Citation spirituelle */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
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
