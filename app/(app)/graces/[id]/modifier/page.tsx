'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, MapPin, Tag, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Grace {
  id: string
  texte: string
  date: string
  lieu: string | null
  tags: string[]
  visibilite: string
}

export default function ModifierGracePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [grace, setGrace] = useState<Grace | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // États du formulaire
  const [texte, setTexte] = useState('')
  const [date, setDate] = useState('')
  const [lieu, setLieu] = useState('')
  const [tags, setTags] = useState('')
  const [visibilite, setVisibilite] = useState('privee')

  useEffect(() => {
    fetchGrace()
  }, [resolvedParams.id])

  const fetchGrace = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      
      setGrace(data)
      setTexte(data.texte)
      setDate(data.date)
      setLieu(data.lieu || '')
      setTags(data.tags?.join(', ') || '')
      setVisibilite(data.visibilite)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Grâce non trouvée')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texte.trim()) {
      setError('Le texte de la grâce est requis')
      return
    }

    setSaving(true)
    setError('')

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error } = await supabase
        .from('graces')
        .update({
          texte: texte.trim(),
          date,
          lieu: lieu.trim() || null,
          tags: tagsArray,
          visibilite,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push(`/graces/${resolvedParams.id}`)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors de la modification')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
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

  if (error && !grace) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/graces" style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#f59e0b',
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour aux grâces
          </Link>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😇</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Grâce introuvable
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
      background: 'linear-gradient(135deg, #fef7ed 0%, #ffffff 50%, #fef3c7 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/graces/${resolvedParams.id}`} style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#f59e0b',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
            Retour à la grâce
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
            background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
            padding: '1.5rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>✨</div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Modifier la grâce
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Ajustez les détails de cette grâce reçue
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
                <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Texte de la grâce */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Tag style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
                Quelle grâce avez-vous reçue ? *
              </label>
              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                rows={4}
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
                  e.target.style.borderColor = '#f59e0b'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Décrivez la grâce reçue..."
                required
              />
            </div>

            {/* Date */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
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
                  e.target.style.borderColor = '#f59e0b'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
            </div>

            {/* Lieu */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <MapPin style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
                Lieu (optionnel)
              </label>
              <input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
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
                  e.target.style.borderColor = '#f59e0b'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Où cette grâce a-t-elle eu lieu ?"
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Tag style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
                Étiquettes (séparées par des virgules)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
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
                  e.target.style.borderColor = '#f59e0b'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="guérison, famille, prière..."
              />
            </div>

            {/* Visibilité */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                <Eye style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
                Visibilité
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="privee"
                    checked={visibilite === 'privee'}
                    onChange={(e) => setVisibilite(e.target.value)}
                    style={{ width: '1rem', height: '1rem', marginRight: '0.75rem', accentColor: '#f59e0b' }}
                  />
                  <span style={{ color: '#374151' }}>Privée</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="anonyme"
                    checked={visibilite === 'anonyme'}
                    onChange={(e) => setVisibilite(e.target.value)}
                    style={{ width: '1rem', height: '1rem', marginRight: '0.75rem', accentColor: '#f59e0b' }}
                  />
                  <span style={{ color: '#374151' }}>Anonyme</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="publique"
                    checked={visibilite === 'publique'}
                    onChange={(e) => setVisibilite(e.target.value)}
                    style={{ width: '1rem', height: '1rem', marginRight: '0.75rem', accentColor: '#f59e0b' }}
                  />
                  <span style={{ color: '#374151' }}>Publique</span>
                </label>
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link
                href={`/graces/${resolvedParams.id}`}
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
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#d1d5db' : '#f59e0b',
                  color: 'white',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: saving ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.target.style.background = '#d97706'
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.target.style.background = '#f59e0b'
                }}
              >
                <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Citation spirituelle */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{
            color: '#f59e0b',
            fontStyle: 'italic',
            fontSize: '1.125rem',
            margin: 0
          }}>
            "Que notre cœur se tourne vers le Seigneur" - Saint Augustin
          </p>
        </div>
      </div>
    </div>
  )
}
