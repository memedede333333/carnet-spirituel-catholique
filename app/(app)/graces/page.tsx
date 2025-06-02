'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Sparkles } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Grace {
  id: string
  texte: string
  date: string
  lieu?: string
  tags?: string[]
  visibilite: string
  created_at: string
}

export default function GracesPage() {
  const [graces, setGraces] = useState<Grace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGraces()
  }, [])

  const fetchGraces = async () => {
    try {
      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setGraces(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">✨</div>
          <p>Chargement des grâces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header-modern">
        <div className="page-title-section">
          <div className="page-icon-wrapper gold-gradient">
            <Sparkles size={32} className="text-amber-700" />
          </div>
          <div>
            <h1 className="page-title">Grâces reçues</h1>
            <p className="page-subtitle">Gardez mémoire des merveilles de Dieu</p>
          </div>
        </div>
        <Link href="/graces/nouvelle" className="btn-primary-spiritual">
          <Plus size={20} />
          <span>Nouvelle grâce</span>
        </Link>
      </div>

      {graces.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">✨</div>
          <h3>Aucune grâce enregistrée</h3>
          <p>Commencez à noter les merveilles que Dieu fait dans votre vie</p>
          <Link href="/graces/nouvelle" className="btn-primary-spiritual">
            <Plus size={20} />
            <span>Noter ma première grâce</span>
          </Link>
        </div>
      ) : (
        <div className="content-grid">
          {graces.map((grace, index) => (
            <Link
              key={grace.id}
              href={`/graces/${grace.id}`}
              className="content-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header-modern">
                <div className="card-date">
                  <Calendar size={16} className="text-amber-600" />
                  <span>{format(new Date(grace.date), 'd MMMM yyyy', { locale: fr })}</span>
                </div>
                {grace.lieu && (
                  <div className="card-location">
                    <MapPin size={16} className="text-amber-600" />
                    <span>{grace.lieu}</span>
                  </div>
                )}
              </div>
              
              <p className="card-text">{grace.texte}</p>
              
              {grace.tags && grace.tags.length > 0 && (
                <div className="card-tags">
                  {grace.tags.map((tag, idx) => (
                    <span key={idx} className="tag-spiritual tag-amber">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="card-footer-spiritual">
                <span className="read-more">Lire la suite →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
