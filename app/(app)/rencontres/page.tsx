'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface RencontreMissionnaire {
  id: string
  personne_prenom: string
  personne_nom?: string
  lieu: string
  date: string
  contexte?: string
  description: string
  fruit_immediat?: string
  fruit_espere?: string
  created_at: string
}

export default function RencontresPage() {
  const [rencontres, setRencontres] = useState<RencontreMissionnaire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRencontres()
  }, [])

  const fetchRencontres = async () => {
    try {
      const { data, error } = await supabase
        .from('rencontres_missionnaires')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setRencontres(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des rencontres:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </Link>
        <h1>Rencontres missionnaires</h1>
        <Link href="/rencontres/nouvelle" className="btn btn-primary">
          <Plus size={20} />
          <span>Nouvelle rencontre</span>
        </Link>
      </div>

      {rencontres.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>Aucune rencontre missionnaire enregistrée</p>
          <Link href="/rencontres/nouvelle" className="btn btn-primary">
            <Plus size={20} />
            <span>Ajouter votre première rencontre</span>
          </Link>
        </div>
      ) : (
        <div className="cards-grid">
          {rencontres.map((rencontre) => (
            <Link
              key={rencontre.id}
              href={`/rencontres/${rencontre.id}`}
              className="card card-link"
            >
              <div className="card-header">
                <h3>
                  {rencontre.personne_prenom} {rencontre.personne_nom}
                </h3>
              </div>
              
              <div className="card-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  {format(new Date(rencontre.date), 'd MMMM yyyy', { locale: fr })}
                </span>
                <span className="meta-item">
                  <MapPin size={16} />
                  {rencontre.lieu}
                </span>
              </div>

              {rencontre.contexte && (
                <p className="card-context">{rencontre.contexte}</p>
              )}

              <p className="card-description">{rencontre.description}</p>

              {rencontre.fruit_immediat && (
                <div className="card-fruits">
                  <strong>Fruits immédiats :</strong>
                  <p>{rencontre.fruit_immediat}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
