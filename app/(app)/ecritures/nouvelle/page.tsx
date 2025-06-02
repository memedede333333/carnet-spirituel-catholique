'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { rechercherPassageBiblique } from '@/app/lib/aelf'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CONTEXTES = [
  { value: 'messe', label: 'Messe' },
  { value: 'lectio', label: 'Lectio Divina' },
  { value: 'retraite', label: 'Retraite' },
  { value: 'groupe', label: 'Groupe de prière' },
  { value: 'personnel', label: 'Lecture personnelle' }
]

export default function NouvelleEcriturePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [reference, setReference] = useState('')
  const [texteComplet, setTexteComplet] = useState('')
  const [contexte, setContexte] = useState('personnel')
  const [dateReception, setDateReception] = useState(new Date().toISOString().split('T')[0])
  const [ceQuiMaTouche, setCeQuiMaTouche] = useState('')
  const [pourQui, setPourQui] = useState('moi')
  const [fruits, setFruits] = useState('')
  const [visibilite, setVisibilite] = useState<'prive' | 'anonyme' | 'public'>('prive')

  const rechercherTexte = async () => {
    if (!reference.trim()) return

    setSearching(true)
    try {
      const texte = await rechercherPassageBiblique(reference)
      if (texte) {
        setTexteComplet(texte)
      } else {
        // Si l'API ne retourne rien, on laisse l'utilisateur entrer le texte manuellement
        alert('Texte non trouvé. Vous pouvez le saisir manuellement.')
      }
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      setSearching(false)
    }
  }

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

      const fruitsArray = fruits
        .split(',')
        .map(fruit => fruit.trim())
        .filter(fruit => fruit.length > 0)

      const { error } = await supabase
        .from('paroles_ecriture')
        .insert({
          user_id: user.id,
          reference,
          texte_complet: texteComplet,
          contexte,
          date_reception: dateReception,
          ce_qui_ma_touche: ceQuiMaTouche,
          pour_qui: pourQui,
          fruits: fruitsArray.length > 0 ? fruitsArray : null,
          visibilite
        })

      if (error) throw error

      router.push('/ecritures')
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/ecritures" className="text-primary hover:underline mb-2 inline-block">
            ← Retour aux écritures
          </Link>
          <h1 className="text-2xl font-bold text-primary font-serif">
            Noter une parole de l'Écriture
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium mb-2">
                Référence biblique *
              </label>
              <div className="flex gap-2">
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                  className="input flex-1"
                  placeholder="Ex: Jn 3, 16 ou Mt 5, 1-12"
                />
                <button
                  type="button"
                  onClick={rechercherTexte}
                  disabled={searching}
                  className="btn-secondary"
                >
                  {searching ? 'Recherche...' : 'Chercher AELF'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="texte" className="block text-sm font-medium mb-2">
                Texte complet *
              </label>
              <textarea
                id="texte"
                value={texteComplet}
                onChange={(e) => setTexteComplet(e.target.value)}
                required
                rows={6}
                className="textarea"
                placeholder="Collez ou tapez le passage biblique ici..."
              />
            </div>

            <div>
              <label htmlFor="contexte" className="block text-sm font-medium mb-2">
                Contexte *
              </label>
              <select
                id="contexte"
                value={contexte}
                onChange={(e) => setContexte(e.target.value)}
                required
                className="input"
              >
                {CONTEXTES.map((ctx) => (
                  <option key={ctx.value} value={ctx.value}>
                    {ctx.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date de réception *
              </label>
              <input
                id="date"
                type="date"
                value={dateReception}
                onChange={(e) => setDateReception(e.target.value)}
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="touche" className="block text-sm font-medium mb-2">
                Ce qui m'a touché *
              </label>
              <textarea
                id="touche"
                value={ceQuiMaTouche}
                onChange={(e) => setCeQuiMaTouche(e.target.value)}
                required
                rows={3}
                className="textarea"
                placeholder="Qu'est-ce qui vous a particulièrement parlé dans ce passage ?"
              />
            </div>

            <div>
              <label htmlFor="pour" className="block text-sm font-medium mb-2">
                Pour qui ? *
              </label>
              <input
                id="pour"
                type="text"
                value={pourQui}
                onChange={(e) => setPourQui(e.target.value)}
                required
                className="input"
                placeholder="Moi, prénom de quelqu'un, le groupe..."
              />
            </div>

            <div>
              <label htmlFor="fruits" className="block text-sm font-medium mb-2">
                Fruits (séparés par des virgules)
              </label>
              <input
                id="fruits"
                type="text"
                value={fruits}
                onChange={(e) => setFruits(e.target.value)}
                className="input"
                placeholder="Paix, consolation, conversion..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visibilité
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="prive"
                    checked={visibilite === 'prive'}
                    onChange={(e) => setVisibilite(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Privée</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="anonyme"
                    checked={visibilite === 'anonyme'}
                    onChange={(e) => setVisibilite(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Anonyme</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="public"
                    checked={visibilite === 'public'}
                    onChange={(e) => setVisibilite(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Publique</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Link href="/ecritures" className="btn-secondary">
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
