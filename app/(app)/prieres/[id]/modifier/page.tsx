'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, HandHeart, User, Calendar, MessageSquare, Hash, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Priere {
  id: string
  type: 'guerison' | 'freres' | 'intercession'
  personne_prenom: string
  personne_nom?: string
  date: string
  sujet: string
  sujet_detail?: string
  nombre_fois: number
  notes?: string
  visibilite: string
}

export default function ModifierPrierePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [priere, setPriere] = useState<Priere | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [type, setType] = useState<'guerison' | 'freres' | 'intercession'>('guerison')
  const [personnePrenom, setPersonnePrenom] = useState('')
  const [personneNom, setPersonneNom] = useState('')
  const [date, setDate] = useState('')
  const [sujet, setSujet] = useState('')
  const [sujetDetail, setSujetDetail] = useState('')
  const [nombreFois, setNombreFois] = useState(1)
  const [notes, setNotes] = useState('')
  const [visibilite, setVisibilite] = useState('prive')

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
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
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
      setError('Prière non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personnePrenom.trim() || !sujet.trim()) {
      setError('Le prénom et le sujet de prière sont requis')
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
      setError('Erreur lors de la modification')
    } finally {
      setSaving(false)
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

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>✏️</div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Modifier la prière
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Mettez à jour les informations de cette intention de prière
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

            <div style={{ marginBottom: '2rem' }}>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {[
                  { value: 'guerison', label: 'Prière de guérison', icon: '🏥' },
                  { value: 'freres', label: 'Prière des frères', icon: '👥' },
                  { value: 'intercession', label: 'Intercession', icon: '🙏' }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: `2px solid ${type === option.value ? getTypeColor(option.value) : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: type === option.value ? `${getTypeColor(option.value)}10` : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={type === option.value}
                      onChange={(e) => setType(e.target.value as 'guerison' | 'freres' | 'intercession')}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      border: `2px solid ${getTypeColor(option.value)}`,
                      background: type === option.value ? getTypeColor(option.value) : 'white',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {type === option.value && (
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
                        {option.icon} {option.label}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
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
                <User style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Personne concernée *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input
                  type="text"
                  value={personnePrenom}
                  onChange={(e) => setPersonnePrenom(e.target.value)}
                  placeholder="Prénom *"
                  required
                  style={{
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
                <input
                  type="text"
                  value={personneNom}
                  onChange={(e) => setPersonneNom(e.target.value)}
                  placeholder="Nom (optionnel)"
                  style={{
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Date de la prière *
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
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
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
                <MessageSquare style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Sujet de prière *
              </label>
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                required
                placeholder="Ex: Guérison de sa maladie, Paix dans sa famille..."
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                Détails supplémentaires (optionnel)
              </label>
              <textarea
                value={sujetDetail}
                onChange={(e) => setSujetDetail(e.target.value)}
                rows={3}
                placeholder="Informations complémentaires..."
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
                <Hash style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Nombre de fois priées *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="number"
                  value={nombreFois}
                  onChange={(e) => setNombreFois(parseInt(e.target.value) || 1)}
                  min="1"
                  required
                  style={{
                    width: '100px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    textAlign: 'center',
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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 3, 7, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNombreFois(num)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: nombreFois === num ? '#6366f1' : '#f3f4f6',
                        color: nombreFois === num ? 'white' : '#374151',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                Notes personnelles (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Contexte, inspirations, ressentis..."
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
              />
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
                <Eye style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#6366f1' }} />
                Visibilité *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { value: 'prive', label: 'Privé', description: 'Visible uniquement par vous', icon: '🔒' },
                  { value: 'anonyme', label: 'Anonyme', description: 'Partageable sans noms', icon: '👤' },
                  { value: 'public', label: 'Public', description: 'Partageable avec noms', icon: '🌍' }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: `2px solid ${visibilite === option.value ? '#6366f1' : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: visibilite === option.value ? 'rgba(99, 102, 241, 0.1)' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={visibilite === option.value}
                      onChange={(e) => setVisibilite(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      border: '2px solid #6366f1',
                      background: visibilite === option.value ? '#6366f1' : 'white',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {visibilite === option.value && (
                        <div style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          background: 'white'
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        {option.icon} {option.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
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
                  background: saving ? '#d1d5db' : '#6366f1',
                  color: 'white',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: saving ? 0.5 : 1,
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.target.style.background = '#4f46e5'
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.target.style.background = '#6366f1'
                }}
              >
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        <div style={{
          marginTop: '2rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem',
          borderLeft: '4px solid #6366f1'
        }}>
          <div style={{ display: 'flex', alignItems: 'start' }}>
            <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💡</div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                Conseil spirituel
              </h3>
              <p style={{ color: '#92400e', lineHeight: '1.6', margin: 0 }}>
                "Demandez et l'on vous donnera" (Mt 7:7). N'hésitez pas à mettre à jour vos intentions 
                au fur et à mesure que la situation évolue. Chaque prière est entendue par le Seigneur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
