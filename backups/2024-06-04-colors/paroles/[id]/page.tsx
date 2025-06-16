'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PageParams {
  params: Promise<{ id: string }>
}

export default function ParoleDetailPage({ params }: PageParams) {
  const resolvedParams = use(params)
  const [parole, setParole] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

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
      setParole(data)
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/paroles')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette parole ?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('paroles_connaissance')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/paroles')
    } catch (error) {
      console.error('Erreur:', error)
      setDeleting(false)
    }
  }

  const getContexteLabel = (contexte: string) => {
    const labels: Record<string, string> = {
      personnel: 'Personnel',
      veillee: 'Veillée de prière',
      mission: 'Mission',
      autre: 'Autre'
    }
    return labels[contexte] || contexte
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!parole) {
    return (
      <div className="container">
        <div className="alert alert-error">Parole non trouvée</div>
        <Link href="/paroles" className="btn btn-secondary">
          Retour aux paroles
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-header">
        <Link href="/paroles" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          Retour
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">
                {getContexteLabel(parole.contexte)}
              </span>
              {parole.accomplie && (
                <span className="badge badge-success">
                  <CheckCircle size={14} />
                  Accomplie
                </span>
              )}
            </div>
            <time style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Reçue le {format(new Date(parole.created_at), 'dd MMMM yyyy', { locale: fr })}
            </time>
          </div>
          <div className="action-group">
            <Link href={`/paroles/${resolvedParams.id}/modifier`} className="btn btn-primary btn-sm">
              <Edit size={16} />
              Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-danger btn-sm" disabled={deleting}>
              <Trash2 size={16} />
              {deleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Parole reçue
          </h2>
          <blockquote style={{
            borderLeft: '4px solid var(--primary)',
            paddingLeft: '1rem',
            marginLeft: 0,
            fontStyle: 'italic',
            fontSize: '1.125rem',
            color: 'var(--text-primary)'
          }}>
            {parole.texte}
          </blockquote>
        </div>

        {parole.destinataire && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Destinataire
            </h3>
            <p>{parole.destinataire}</p>
          </div>
        )}

        {parole.accomplie && (
          <>
            {parole.date_accomplissement && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Date d'accomplissement
                </h3>
                <p>{format(new Date(parole.date_accomplissement), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            )}

            {parole.fruits && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Fruits constatés
                </h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{parole.fruits}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
