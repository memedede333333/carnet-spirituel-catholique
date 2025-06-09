'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, MessageSquare, Users, MapPin, ArrowLeft, Plus, Info } from 'lucide-react'

export default function NouvelleParolePage() {
  const router = useRouter()
  const [texte, setTexte] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [contexte, setContexte] = useState<'personnelle' | 'veillee' | 'mission' | 'priere' | 'autre'>('personnelle')
  const [contexteDetail, setContexteDetail] = useState('')
  const [destinataire, setDestinataire] = useState<'moi' | 'inconnu' | 'personne'>('inconnu')
  const [personneDestinataire, setPersonneDestinataire] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const contexteOptions = [
    { value: 'personnelle', label: 'Personnelle', description: 'Reçue dans l\'intimité' },
    { value: 'veillee', label: 'Veillée', description: 'Lors d\'une veillée de prière' },
    { value: 'mission', label: 'Mission', description: 'En contexte d\'évangélisation' },
    { value: 'priere', label: 'Prière', description: 'Pendant un temps de prière' },
    { value: 'autre', label: 'Autre', description: 'Autre contexte' }
  ]

  const destinataireOptions = [
    { value: 'moi', label: 'Pour moi', description: 'Cette parole m\'est destinée' },
    { value: 'inconnu', label: 'Destinataire inconnu', description: 'Je ne sais pas encore pour qui' },
    { value: 'personne', label: 'Pour quelqu\'un', description: 'Je connais le destinataire' }
  ]

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('paroles_connaissance')
        .insert({
          user_id: user.id,
          texte: texte.trim(),
          date,
          contexte,
          contexte_detail: contexteDetail.trim() || null,
          destinataire,
          personne_destinataire: destinataire === 'personne' ? personneDestinataire.trim() : null,
          fruit_constate: null,
          date_accomplissement: null
        })

      if (error) throw error

      router.push('/paroles')
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
          {/* En-tête bleu ciel pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
            padding: '2rem',
            color: '#075985'
          }}>
            <Link href="/paroles" style={{
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
              Retour aux paroles
            </Link>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <MessageSquare size={32} />
              Nouvelle parole de connaissance
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
                placeholder="Quelle parole avez-vous reçue ?"
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contexteOptions.map(option => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${contexte === option.value ? '#BAE6FD' : '#E5E7EB'}`,
                      background: contexte === option.value ? '#F0F9FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="contexte"
                      value={option.value}
                      checked={contexte === option.value}
                      onChange={(e) => setContexte(e.target.value as typeof contexte)}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: '500',
                        color: contexte === option.value ? '#075985' : '#1F2937',
                        marginBottom: '0.25rem'
                      }}>
                        {option.label}
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6B7280'
                      }}>
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {destinataireOptions.map(option => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${destinataire === option.value ? '#BAE6FD' : '#E5E7EB'}`,
                      background: destinataire === option.value ? '#F0F9FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="destinataire"
                      value={option.value}
                      checked={destinataire === option.value}
                      onChange={(e) => setDestinataire(e.target.value as typeof destinataire)}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: '500',
                        color: destinataire === option.value ? '#075985' : '#1F2937',
                        marginBottom: '0.25rem'
                      }}>
                        {option.label}
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6B7280'
                      }}>
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              
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

            {/* Message d'information */}
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '2rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <Info size={20} style={{ color: '#075985', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.875rem', color: '#075985' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  Les paroles de connaissance sont des inspirations de l'Esprit Saint pour encourager, consoler ou guider.
                </p>
                <p>
                  Vous pourrez ajouter plus tard le fruit constaté de cette parole.
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
                href="/paroles"
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
                <Plus size={20} />
                {saving ? 'Enregistrement...' : 'Enregistrer la parole'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}