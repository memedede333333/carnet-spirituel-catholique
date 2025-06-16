'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2, MapPin, Calendar, Users, Heart, Sparkles } from 'lucide-react'
import type { RencontreMissionnaire } from '@/app/types'

export default function RencontreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [rencontre, setRencontre] = useState<RencontreMissionnaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchRencontre()
  }, [resolvedParams.id])

  async function fetchRencontre() {
    try {
      const { data, error } = await supabase
        .from('rencontres_missionnaires')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setRencontre(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette rencontre ?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('rencontres_missionnaires')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/rencontres')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
      setDeleting(false)
    }
  }

  const getContexteLabel = (contexte: string) => {
    const labels: Record<string, string> = {
      rue: 'Dans la rue',
      paroisse: 'À la paroisse',
      travail: 'Au travail',
      mission: 'En mission',
      autre: 'Autre'
    }
    return labels[contexte] || contexte
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!rencontre) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p>Rencontre non trouvée</p>
            <Link href="/rencontres" className="btn btn-secondary">Retour</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/rencontres" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* En-tête coloré */}
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            padding: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  <Users style={{ display: 'inline', marginRight: '0.5rem' }} size={24} />
                  {rencontre.personne_prenom} {rencontre.personne_nom || ''}
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                  {rencontre.visibilite === 'prive' ? 'Privé' : rencontre.visibilite === 'anonyme' ? 'Anonyme' : 'Public'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  href={`/rencontres/${rencontre.id}/modifier`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    transition: 'background 0.2s'
                  }}
                >
                  <Pencil size={16} />
                  Modifier
                </Link>
                <button 
                  onClick={handleDelete}
                  style={{
                    background: 'rgba(239, 68, 68, 0.8)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            {/* Infos date et lieu */}
            <div style={{ 
              display: 'flex', 
              gap: '2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                <Calendar size={18} />
                <span>{new Date(rencontre.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              {rencontre.lieu && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <MapPin size={18} />
                  <span>{rencontre.lieu}</span>
                </div>
              )}
            </div>

            {/* Contexte */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
                Contexte
              </h3>
              <p style={{ 
                background: '#fef3c7',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: '#92400e',
                display: 'inline-block'
              }}>
                {getContexteLabel(rencontre.contexte)}
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
                Description de la rencontre
              </h3>
              <div style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #f43f5e'
              }}>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                  {rencontre.description}
                </p>
              </div>
            </div>

            {/* Fruits */}
            {(rencontre.fruit_immediat || rencontre.fruit_espere) && (
              <div style={{ marginTop: '2rem' }}>
                {rencontre.fruit_immediat && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      marginBottom: '0.75rem', 
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Heart size={20} color="#10b981" />
                      Fruits immédiats
                    </h3>
                    <p style={{ 
                      color: '#059669',
                      background: '#d1fae5',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      lineHeight: '1.6'
                    }}>
                      {rencontre.fruit_immediat}
                    </p>
                  </div>
                )}

                {rencontre.fruit_espere && (
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      marginBottom: '0.75rem', 
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Sparkles size={20} color="#6366f1" />
                      Fruits espérés
                    </h3>
                    <p style={{ 
                      color: '#4338ca',
                      background: '#e0e7ff',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      lineHeight: '1.6'
                    }}>
                      {rencontre.fruit_espere}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Date de création */}
            <div style={{ 
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e5e7eb',
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              Créée le {new Date(rencontre.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} à {new Date(rencontre.created_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Citation en bas */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            "Va, et toi aussi, fais de même."
          </p>
          <p style={{ fontSize: '0.875rem' }}>Luc 10, 37</p>
        </div>
      </div>
    </div>
  )
}