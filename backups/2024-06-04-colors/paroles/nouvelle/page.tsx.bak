'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NouvelleParole() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    texte: '',
    contexte: 'personnel',
    destinataire: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { error } = await supabase
        .from('paroles_connaissance')
        .insert({
          user_id: user.id,
          texte: formData.texte,
          contexte: formData.contexte,
          destinataire: formData.destinataire || null,
          accomplie: false
        })

      if (error) throw error

      router.push('/paroles')
    } catch (error: any) {
      console.error('Erreur:', error)
      setError(error.message)
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="section-header">
        <Link href="/paroles" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Retour
        </Link>
        <h1 className="section-title">Noter une parole de connaissance</h1>
        <p className="section-subtitle">
          Une parole reçue dans la prière, pour vous ou pour d'autres
        </p>
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
              placeholder="Écrivez la parole telle que vous l'avez reçue..."
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

          <div className="action-group">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href="/paroles" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
