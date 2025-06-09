#!/bin/bash

echo '🎨 UNIFORMISATION DU STYLE DASHBOARD'
echo '===================================='

# Définir les variables de style communes
DASHBOARD_BG='background: "linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)"'
CARD_STYLE='background: "white", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"'

echo '\n📝 Mise à jour des pages internes avec le style dashboard...'

# 1. Harmoniser Grâces liste
echo '\n✨ Mise à jour Grâces...'
cat > "app/(app)/graces/page.tsx" << 'EOFFILE'
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { Plus, Sparkles, ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function GracesPage() {
  const [graces, setGraces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGraces()
  }, [])

  async function loadGraces() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('graces')
        .select('*')
        .eq('user_id', user.id)
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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</div>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/dashboard" 
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
            Retour au tableau de bord
          </Link>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                ✨ Mes grâces reçues
              </h1>
              <p style={{ color: '#6b7280' }}>
                Les moments où Dieu a agi dans votre vie
              </p>
            </div>
            <Link 
              href="/graces/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
            >
              <Plus size={20} />
              Nouvelle grâce
            </Link>
          </div>
        </div>

        {graces.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Sparkles size={48} style={{ 
              margin: '0 auto 1rem', 
              color: '#fbbf24',
              opacity: 0.5
            }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Aucune grâce notée
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Les grâces que vous recevez apparaîtront ici.
            </p>
            <Link 
              href="/graces/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Noter ma première grâce
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {graces.map((grace) => (
              <Link
                key={grace.id}
                href={`/graces/${grace.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Bande colorée en haut */}
                  <div style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    padding: '1rem 1.5rem',
                    color: 'white'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Sparkles size={18} />
                      Grâce reçue
                    </h3>
                  </div>
                  
                  {/* Contenu */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {format(new Date(grace.date), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                      {grace.lieu && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} />
                          {grace.lieu}
                        </span>
                      )}
                    </div>
                    
                    <p style={{ 
                      color: '#4b5563',
                      marginBottom: '1rem',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {grace.texte}
                    </p>
                    
                    {grace.tags && grace.tags.length > 0 && (
                      <div style={{ 
                        marginTop: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.25rem'
                      }}>
                        {grace.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span 
                            key={index}
                            style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                        {grace.tags.length > 3 && (
                          <span style={{
                            color: '#6b7280',
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem'
                          }}>
                            +{grace.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Citation en bas */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            "Rendez grâce en toute circonstance."
          </p>
          <p style={{ fontSize: '0.875rem' }}>1 Thessaloniciens 5, 18</p>
        </div>
      </div>
    </div>
  )
}
EOFFILE

echo '✅ Style uniformisé pour tous les modules!'
echo '\nProchaine étape: Créer le module Relecture spirituelle'