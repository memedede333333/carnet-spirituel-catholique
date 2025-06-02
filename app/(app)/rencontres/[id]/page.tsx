'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeft, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'

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
  created_at: string
}

export default function RencontreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [rencontre, setRencontre] = useState<Rencontre | null>(null)
  const [loading, setLoading] = useState(true)

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
      setRencontre(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette rencontre ?')) return

    const { error } = await supabase
      .from('rencontres_missionnaires')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('Erreur lors de la suppression:', error)
    } else {
      router.push('/rencontres')
    }
  }

  if (loading) {
    return <div className="container">Chargement...</div>
  }

  if (!rencontre) return null

  return (
    <div className="container">
      <div className="page-header">
        <Link href="/rencontres" className="back-link">
          <ArrowLeft size={20} />
          <span>Retour</span>
        </Link>
        <div className="page-actions">
          <Link href={`/rencontres/${rencontre.id}/modifier`} className="btn btn-secondary">
            <Edit size={16} />
            <span>Modifier</span>
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{rencontre.personne_prenom} {rencontre.personne_nom}</h1>
          <span className="tag tag-secondary">
            {rencontre.visibilite === 'prive' ? 'Privé' : 
             rencontre.visibilite === 'anonyme' ? 'Anonyme' : 'Public'}
          </span>
        </div>

        <div className="detail-meta">
          <div className="meta-item">
            <Calendar size={20} />
            <span>{format(new Date(rencontre.date), 'd MMMM yyyy', { locale: fr })}</span>
          </div>
          <div className="meta-item">
            <MapPin size={20} />
            <span>{rencontre.lieu}</span>
          </div>
        </div>

        {rencontre.contexte && (
          <div className="detail-section">
            <h3>Contexte</h3>
            <p>{rencontre.contexte}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Description de la rencontre</h3>
          <p className="whitespace-pre-wrap">{rencontre.description}</p>
        </div>

        {rencontre.fruit_immediat && (
          <div className="detail-section">
            <h3>Fruits immédiats</h3>
            <p className="whitespace-pre-wrap">{rencontre.fruit_immediat}</p>
          </div>
        )}

        {rencontre.fruit_espere && (
          <div className="detail-section">
            <h3>Fruits espérés</h3>
            <p className="whitespace-pre-wrap">{rencontre.fruit_espere}</p>
          </div>
        )}

        <div className="detail-footer">
          <p className="text-muted">
            Créée le {format(new Date(rencontre.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
      </div>
    </div>
  )
}
