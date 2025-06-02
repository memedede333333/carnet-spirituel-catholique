'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Rencontre {
  id: string
  personne_prenom: string
  personne_nom?: string
  lieu: string
  date: string
  contexte?: string
  description: string
  fruit_immediat?: string
  fruit_espere?: string
  visibilite: string
}

export default function ModifierRencontrePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [personnePrenom, setPersonnePrenom] = useState('')
  const [personneNom, setPersonneNom] = useState('')
  const [lieu, setLieu] = useState('')
  const [date, setDate] = useState('')
  const [contexte, setContexte] = useState('')
  const [description, setDescription] = useState('')
  const [fruitImmediat, setFruitImmediat] = useState('')
  const [fruitEspere, setFruitEspere] = useState('')
  const [visibilite, setVisibilite] = useState<'prive' | 'anonyme' | 'public'>('prive')

  useEffect(() => {
    loadRencontre()
  }, [resolvedParams.id])

  const loadRencontre = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('rencontres_missionnaires')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error || !data) {
      console.error('Erreur:', error)
      router.push('/rencontres')
    } else {
      setPersonnePrenom(data.personne_prenom)
      setPersonneNom(data.personne_nom || '')
      setLieu(data.lieu)
      setDate(data.date)
      setContexte(data.contexte || '')
      setDescription(data.description)
      setFruitImmediat(data.fruit_immediat || '')
      setFruitEspere(data.fruit_espere || '')
      setVisibilite(data.visibilite)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('rencontres_missionnaires')
        .update({
          personne_prenom: personnePrenom,
          personne_nom: personneNom || null,
          lieu,
          date,
          contexte,
          description,
          fruit_immediat: fruitImmediat || null,
          fruit_espere: fruitEspere || null,
          visibilite
        })
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push(`/rencontres/${resolvedParams.id}`)
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <Link href={`/rencontres/${resolvedParams.id}`} className="back-link">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </Link>
        <h1>Modifier la rencontre</h1>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="form-section">
          <h2>Personne rencontrée</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input
                id="prenom"
                type="text"
                value={personnePrenom}
                onChange={(e) => setPersonnePrenom(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                type="text"
                value={personneNom}
                onChange={(e) => setPersonneNom(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Circonstances</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lieu">Lieu *</label>
              <input
                id="lieu"
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contexte">Contexte *</label>
            <input
              id="contexte"
              type="text"
              value={contexte}
              onChange={(e) => setContexte(e.target.value)}
              required
              className="input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Description de la rencontre</h2>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fruitImmediat">Fruits immédiats</label>
            <textarea
              id="fruitImmediat"
              value={fruitImmediat}
              onChange={(e) => setFruitImmediat(e.target.value)}
              className="textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fruitEspere">Fruits espérés</label>
            <textarea
              id="fruitEspere"
              value={fruitEspere}
              onChange={(e) => setFruitEspere(e.target.value)}
              className="textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Visibilité</label>
            <select
              value={visibilite}
              onChange={(e) => setVisibilite(e.target.value as any)}
              className="input"
            >
              <option value="prive">Privée</option>
              <option value="anonyme">Anonyme</option>
              <option value="public">Publique</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Link href={`/rencontres/${resolvedParams.id}`} className="btn btn-secondary">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
