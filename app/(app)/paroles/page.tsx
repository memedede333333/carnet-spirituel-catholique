'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { Plus, MessageSquare, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function ParolesPage() {
  const [paroles, setParoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadParoles()
  }, [])

  async function loadParoles() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('paroles_connaissance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setParoles(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="container">
      <div className="section-header">
        <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Retour au tableau de bord
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="section-title">Mes paroles de connaissance</h1>
          <Link href="/paroles/nouvelle" className="btn btn-primary">
            <Plus size={20} />
            Nouvelle parole
          </Link>
        </div>
      </div>

      {paroles.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>Aucune parole notée</h3>
          <p>Les paroles de connaissance que vous recevez apparaîtront ici.</p>
          <Link href="/paroles/nouvelle" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Noter ma première parole
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paroles.map((parole) => (
            <Link
              key={parole.id}
              href={`/paroles/${parole.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">
                        {getContexteLabel(parole.contexte)}
                      </span>
                      {parole.accomplie && (
                        <span className="badge badge-success">Accomplie</span>
                      )}
                    </div>
                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      {parole.texte}
                    </p>
                    {parole.destinataire && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Pour : {parole.destinataire}
                      </p>
                    )}
                  </div>
                  <time style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {format(new Date(parole.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
