'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Calendar, User, Heart, Users, HandHeart, ArrowLeft, Save, Info } from 'lucide-react'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom: string | null
  date: string
  sujet: string
  sujet_detail: string | null
  nombre_fois: number
  notes: string | null
  visibilite: string
}

const typeOptions = [
  {
    value: 'guerison',
    label: 'Prière de guérison',
    icon: Heart,
    description: 'Pour la guérison physique, psychologique ou spirituelle',
    colors: {
      bg: '#FEE2E2',
      border: '#FECACA',
      text: '#991B1B',
      light: '#FEF2F2'
    }
  },
  {
    value: 'freres',
    label: 'Prière des frères',
    icon: Users,
    description: 'Intercession communautaire pour des besoins spécifiques',
    colors: {
      bg: '#E0E7FF',
      border: '#C7D2FE',
      text: '#3730A3',
      light: '#EEF2FF'
    }
  },
  {
    value: 'intercession',
    label: 'Intercession',
    icon: HandHeart,
    description: 'Porter quelqu\'un ou une situation dans la prière',
    colors: {
      bg: '#D1FAE5',
      border: '#A7F3D0',
      text: '#064E3B',
      light: '#ECFDF5'
    }
  }
]

export default function ModifierPrierePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [priere, setPriere] = useState<Priere | null>(null)
  const [type, setType] = useState<'guerison' | 'freres' | 'intercession'>('intercession')
  const [personnePrenom, setPersonnePrenom] = useState('')
  const [personneNom, setPersonneNom] = useState('')
  const [date, setDate] = useState('')
  const [sujet, setSujet] = useState('')
  const [sujetDetail, setSujetDetail] = useState('')
  const [nombreFois, setNombreFois] = useState(1)
  const [notes, setNotes] = useState('')
  const [visibilite, setVisibilite] = useState<'prive' | 'anonyme' | 'public'>('prive')
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
      setType(data.type)
      setPersonnePrenom(data.personne_prenom)
      setPersonneNom(data.personne_nom || '')
      setDate(data.date)
      setSujet(data.sujet)
      setSujetDetail(data.sujet_detail || '')
      setNombreFois(data.nombre_fois)
      setNotes(data.notes || '')
      setVisibilite(data.visibilite)
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/prieres')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!personnePrenom.trim()) {
      setError('Veuillez indiquer le prénom de la personne')
      return
    }

    if (!sujet.trim()) {
      setError('Veuillez indiquer le sujet de prière')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('prieres')
        .update({
          type,
          personne_prenom: personnePrenom.trim(),
          personne_nom: personneNom.trim() || null,
          date,
          sujet: sujet.trim(),
          sujet_detail: sujetDetail.trim() || null,
          nombre_fois: nombreFois,
          notes: notes.trim() || null,
          visibilite
        })
        .eq('id', resolvedParams.id)

      if (error) throw error

      router.push(`/prieres/${resolvedParams.id}`)
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
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🙏</div>
          <p style={{ color: '#1E3A8A' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!priere) return null

  const selectedType = typeOptions.find(t => t.value === type)!

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
          {/* En-tête bleu pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
            padding: '2rem',
            color: '#1E3A8A'
          }}>
            <Link href={`/prieres/${resolvedParams.id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#1E3A8A',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}>
              <ArrowLeft size={16} />
              Retour à la prière
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
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                🙏
              </div>
              Modifier la prière
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

            {/* Type de prière */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                Type de prière
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {typeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = type === option.value
                  
                  return (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: `2px solid ${isSelected ? option.colors.border : '#E5E7EB'}`,
                        background: isSelected ? option.colors.light : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => setType(e.target.value as typeof type)}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        background: isSelected ? option.colors.bg : '#F3F4F6',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} style={{ color: isSelected ? option.colors.text : '#6B7280' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontWeight: '600',
                          color: isSelected ? option.colors.text : '#1F2937',
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
                  )
                })}
              </div>
            </div>

            {/* Personne concernée */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                <User size={20} />
                Personne concernée
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
                <input
                  type="text"
                  value={personneNom}
                  onChange={(e) => setPersonneNom(e.target.value)}
                  placeholder="Nom (optionnel)"
                  style={{
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
            </div>

            {/* Sujet de prière */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                Sujet de prière
              </label>
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F0F9FF',
                  marginBottom: '0.75rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#BFDBFE'}
                onBlur={(e) => e.target.style.borderColor = '#DBEAFE'}
              />
              <textarea
                value={sujetDetail}
                onChange={(e) => setSujetDetail(e.target.value)}
                placeholder="Détails supplémentaires (optionnel)"
                rows={3}
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

            {/* Date et nombre de fois */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                  color: '#1E3A8A'
                }}>
                  <Calendar size={20} />
                  Date de début
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#1E3A8A'
                }}>
                  Nombre de fois priées
                </label>
                <input
                  type="number"
                  min="0"
                  value={nombreFois}
                  onChange={(e) => setNombreFois(parseInt(e.target.value) || 0)}
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
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#1E3A8A'
              }}>
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Circonstances, demandes spécifiques..."
                rows={3}
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
