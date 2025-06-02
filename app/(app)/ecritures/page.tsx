'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ParoleEcriture {
  id: string
  reference: string
  texte_complet: string
  contexte: string
  date_reception: string
  ce_qui_ma_touche: string
  pour_qui: string
  fruits?: string[]
  created_at: string
}

export default function EcrituresPage() {
  const router = useRouter()
  const [ecritures, setEcritures] = useState<ParoleEcriture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEcritures()
  }, [])

  const loadEcritures = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('paroles_ecriture')
      .select('*')
      .order('date_reception', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
    } else {
      setEcritures(data || [])
    }
    setLoading(false)
  }

  const getContexteLabel = (contexte: string) => {
    switch (contexte) {
      case 'messe': return 'Messe'
      case 'lectio': return 'Lectio Divina'
      case 'retraite': return 'Retraite'
      case 'groupe': return 'Groupe de prière'
      case 'personnel': return 'Lecture personnelle'
      default: return contexte
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-primary hover:underline mb-2 inline-block">
                ← Retour au tableau de bord
              </Link>
              <h1 className="text-2xl font-bold text-primary font-serif">
                Paroles de l'Écriture
              </h1>
            </div>
            <Link href="/ecritures/nouvelle" className="btn-primary">
              + Nouvelle parole
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {ecritures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-light mb-4">
              Vous n'avez pas encore noté de passages bibliques.
            </p>
            <Link href="/ecritures/nouvelle" className="btn-primary">
              Noter mon premier passage
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ecritures.map((ecriture) => (
              <div key={ecriture.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{ecriture.reference}</h3>
                    <p className="text-text-light mb-2 italic">
                      "{ecriture.texte_complet.substring(0, 150)}
                      {ecriture.texte_complet.length > 150 ? '...' : ''}"
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Ce qui m'a touché :</span> {ecriture.ce_qui_ma_touche}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-text-light">
                      <span>
                        📅 {format(new Date(ecriture.date_reception), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                      <span>
                        📍 {getContexteLabel(ecriture.contexte)}
                      </span>
                      <span>
                        👤 Pour {ecriture.pour_qui}
                      </span>
                    </div>
                    {ecriture.fruits && ecriture.fruits.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Fruits :</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {ecriture.fruits.map((fruit, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gold text-white text-sm rounded"
                            >
                              {fruit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/ecritures/${ecriture.id}`}
                    className="text-primary hover:underline ml-4"
                  >
                    Voir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
