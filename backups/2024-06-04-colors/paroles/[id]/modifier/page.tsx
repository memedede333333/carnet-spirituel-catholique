'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageParams {
  params: Promise<{ id: string }>
}

export default function ModifierParolePage({ params }: PageParams) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    texte: '',
    contexte: 'personnel',
    destinataire: '',
    accomplie: false,
    date_accomplissement: '',
    fruits: ''
  })

  useEffect(() => {
    loadParole()
  }, [resolvedParams.id])

  async function loadParole() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('paroles_connaissance')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      
      setFormData({
        texte: data.texte || '',
        contexte: data.contexte || 'personnel',
        destinataire: data.destinataire || '',
        accomplie: data.accomplie || false,
        date_accomplissement: data.date_accomplissement || '',
        fruits: data.fruits || ''
      })
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/paroles')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('paroles_connaissance')
        .update({
          texte: formData.texte,
          contexte: formData.contexte,
          destinataire: formData.destinataire || null,
          accomplie: formData.accomplie,
          date_accomplissement: formData.accomplie && formData.date_accomplissement ? formData.date_accomplissement : null,
          fruits: formData.accomplie && formData.fruits ? formData.fruits : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)

      if (error) throw error

      router.push(`/paroles/${resolvedParams.id}`)
    } catch (error: any) {
      console.error('Erreur:', error)
      setError(error.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-header">
        <Link href={`/paroles/${resolvedParams.id}`} className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Retour
        </Link>
        <h1 className="section-title">Modifier la parole</h1>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Parole reçue</label>
            <textarea
              className="textarea"
              value={formData.texte}
              onChange={(e) => setFormData({...formData, texte: e.target.value})}
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contexte</label>
            <select
              className="select"
              value={formData.contexte}
              onChange={(e) => setFormData({...formData, contexte: e.target.value})}
            >
              <option value="personnel">Personnel (dans ma prière)</option>
              <option value="veillee">Veillée de prière</option>
              <option value="mission">Mission</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Destinataire (optionnel)</label>
            <input
              type="text"
              className="input"
              value={formData.destinataire}
              onChange={(e) => setFormData({...formData, destinataire: e.target.value})}
              placeholder="Pour qui est cette parole ?"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.accomplie}
                onChange={(e) => setFormData({...formData, accomplie: e.target.checked})}
              />
              <span>Cette parole s'est accomplie</span>
            </label>
          </div>

          {formData.accomplie && (
            <>
              <div className="form-group">
                <label className="form-label">Date d'accomplissement</label>
                <input
                  type="date"
                  className="input"
                  value={formData.date_accomplissement}
                  onChange={(e) => setFormData({...formData, date_accomplissement: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fruits constatés</label>
                <textarea
                  className="textarea"
                  value={formData.fruits}
                  onChange={(e) => setFormData({...formData, fruits: e.target.value})}
                  placeholder="Qu'est-ce qui s'est passé ? Quels fruits avez-vous observés ?"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="action-group">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            <Link href={`/paroles/${resolvedParams.id}`} className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
