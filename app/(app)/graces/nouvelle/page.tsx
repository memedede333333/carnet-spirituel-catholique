'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NouvelleGracePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [texte, setTexte] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [lieu, setLieu] = useState('')
  const [tags, setTags] = useState('')
  const [visibilite, setVisibilite] = useState<'prive' | 'anonyme' | 'public'>('prive')
  const [proposerPartage, setProposerPartage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error } = await supabase
        .from('graces')
        .insert({
          user_id: user.id,
          texte,
          date,
          lieu: lieu || null,
          tags: tagsArray,
          visibilite,
          statut_partage: proposerPartage ? 'propose' : 'brouillon'
        })

      if (error) throw error

      router.push('/graces')
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <Link href="/graces" className="back-link-spiritual">
          <ArrowLeft size={20} />
          <span>Retour aux grâces</span>
        </Link>
        <div className="form-title-section">
          <div className="page-icon-wrapper gold-gradient">
            <Sparkles size={32} className="text-amber-700" />
          </div>
          <h1 className="form-title">Noter une grâce reçue</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="spiritual-form">
        {error && (
          <div className="alert-error-spiritual">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="form-card">
          <div className="form-section-spiritual">
            <label htmlFor="texte" className="form-label">
              Quelle grâce avez-vous reçue ? ✨
            </label>
            <textarea
              id="texte"
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              required
              rows={4}
              className="textarea-spiritual"
              placeholder="Décrivez la grâce que Dieu vous a donnée..."
            />
          </div>

          <div className="form-grid">
            <div className="form-section-spiritual">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-spiritual"
              />
            </div>

            <div className="form-section-spiritual">
              <label htmlFor="lieu" className="form-label">
                Lieu (optionnel)
              </label>
              <input
                id="lieu"
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                className="input-spiritual"
                placeholder="Où étiez-vous ?"
              />
            </div>
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="tags" className="form-label">
              Étiquettes (séparées par des virgules)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-spiritual"
              placeholder="joie, guérison, conversion..."
            />
          </div>

          <div className="form-section-spiritual">
            <label className="form-label">Visibilité</label>
            <div className="radio-group-spiritual">
              <label className="radio-label">
                <input
                  type="radio"
                  value="prive"
                  checked={visibilite === 'prive'}
                  onChange={(e) => setVisibilite(e.target.value as any)}
                  className="radio-spiritual"
                />
                <span>Privée</span>
                <small>Visible uniquement par moi</small>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="anonyme"
                  checked={visibilite === 'anonyme'}
                  onChange={(e) => setVisibilite(e.target.value as any)}
                  className="radio-spiritual"
                />
                <span>Anonyme</span>
                <small>Partageable sans mon nom</small>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="public"
                  checked={visibilite === 'public'}
                  onChange={(e) => setVisibilite(e.target.value as any)}
                  className="radio-spiritual"
                />
                <span>Publique</span>
                <small>Partageable avec mon prénom</small>
              </label>
            </div>
          </div>

          {(visibilite === 'anonyme' || visibilite === 'public') && (
            <div className="form-section-spiritual">
              <label className="checkbox-label-spiritual">
                <input
                  type="checkbox"
                  checked={proposerPartage}
                  onChange={(e) => setProposerPartage(e.target.checked)}
                  className="checkbox-spiritual"
                />
                <span>Proposer cette grâce au partage communautaire</span>
              </label>
            </div>
          )}
        </div>

        <div className="form-actions-spiritual">
          <Link href="/graces" className="btn-secondary-spiritual">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-spiritual"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Enregistrer la grâce
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
