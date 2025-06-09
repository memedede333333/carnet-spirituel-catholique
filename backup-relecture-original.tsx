'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Heart, BookOpen, Users, MessageSquare, Filter, Calendar, ChevronRight, Eye, Lightbulb, Zap } from 'lucide-react'
import { format, parseISO, isWithinInterval, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function RelecturePage() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<any[]>([])
  const [filteredEntries, setFilteredEntries] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('3months')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all'])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllEntries()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [entries, selectedPeriod, selectedTypes])

  async function loadAllEntries() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      if (!user) {
        console.log('Pas d\'utilisateur connecté')
        return
      }

      // Charger toutes les entrées de tous les modules
      console.log('Chargement des données...')
      
      const [graces, prieres, ecritures, paroles, rencontres] = await Promise.all([
        supabase.from('graces').select('*').eq('user_id', user.id),
        supabase.from('prieres').select('*').eq('user_id', user.id),
        supabase.from('paroles_ecriture').select('*').eq('user_id', user.id),
        supabase.from('paroles_connaissance').select('*').eq('user_id', user.id),
        supabase.from('rencontres_missionnaires').select('*').eq('user_id', user.id)
      ])

      console.log('Résultats:')
      console.log('Grâces:', graces.data?.length || 0, graces.error)
      console.log('Prières:', prieres.data?.length || 0, prieres.error)
      console.log('Écritures:', ecritures.data?.length || 0, ecritures.error)
      console.log('Paroles:', paroles.data?.length || 0, paroles.error)
      console.log('Rencontres:', rencontres.data?.length || 0, rencontres.error)

      // Formater toutes les entrées avec un type unifié
      const allEntries = [
        ...(graces.data || []).map(g => ({ ...g, type: 'grace', date: g.date })),
        ...(prieres.data || []).map(p => ({ ...p, type: 'priere', date: p.date })),
        ...(ecritures.data || []).map(e => ({ ...e, type: 'ecriture', date: e.date_reception })),
        ...(paroles.data || []).map(p => ({ ...p, type: 'parole', date: p.date })),
        ...(rencontres.data || []).map(r => ({ ...r, type: 'rencontre', date: r.date }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      console.log('Total des entrées:', allEntries.length)
      setEntries(allEntries)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  function filterEntries() {
    let filtered = [...entries]

    // Filtre par période
    const now = new Date()
    const periodMap = {
      '1week': 7,
      '1month': 30,
      '3months': 90,
      '6months': 180,
      '1year': 365,
      'all': null
    }

    if (periodMap[selectedPeriod]) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - periodMap[selectedPeriod])
      filtered = filtered.filter(e => new Date(e.date) >= startDate)
    }

    // Filtre par type
    if (!selectedTypes.includes('all')) {
      filtered = filtered.filter(e => selectedTypes.includes(e.type))
    }

    setFilteredEntries(filtered)
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      grace: { icon: Sparkles, color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', label: 'Grâce' },
      priere: { icon: Heart, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', label: 'Prière' },
      ecriture: { icon: BookOpen, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', label: 'Écriture' },
      parole: { icon: MessageSquare, color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', label: 'Parole' },
      rencontre: { icon: Users, color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)', label: 'Rencontre' }
    }
    return configs[type] || { icon: Sparkles, color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #4b5563)', label: 'Autre' }
  }

  const getSuggestions = () => {
    const suggestions = []
    
    // Analyser les patterns
    const graceCount = filteredEntries.filter(e => e.type === 'grace').length
    const priereCount = filteredEntries.filter(e => e.type === 'priere').length
    const accomplishedParoles = filteredEntries.filter(e => e.type === 'parole' && e.accomplie).length
    
    if (graceCount > 5) {
      suggestions.push({
        icon: Lightbulb,
        text: `${graceCount} grâces reçues sur cette période ! Dieu est généreux avec vous.`,
        color: '#fbbf24'
      })
    }
    
    if (accomplishedParoles > 0) {
      suggestions.push({
        icon: Zap,
        text: `${accomplishedParoles} parole${accomplishedParoles > 1 ? 's' : ''} accomplies ! L'Esprit Saint est à l'œuvre.`,
        color: '#0ea5e9'
      })
    }
    
    // Détecter les liens possibles
    const recentPrayers = filteredEntries.filter(e => e.type === 'priere' && new Date(e.date) > subMonths(new Date(), 1))
    const recentGraces = filteredEntries.filter(e => e.type === 'grace' && new Date(e.date) > subMonths(new Date(), 1))
    
    if (recentPrayers.length > 0 && recentGraces.length > 0) {
      suggestions.push({
        icon: Heart,
        text: "Certaines de vos prières récentes semblent avoir porté du fruit...",
        color: '#6366f1',
        action: 'Voir les liens possibles'
      })
    }
    
    return suggestions
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Sparkles size={48} style={{ color: '#a855f7', margin: '0 auto 1rem', animation: 'pulse 2s ease-in-out infinite' }} />
          <p style={{ color: '#6b7280' }}>Tissage du fil d'or en cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
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
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ef4444' }}>{error}</p>
            <Link href="/dashboard" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Retour au tableau de bord</Link>
          </div>
        </div>
      </div>
    )
  }

  const suggestions = getSuggestions()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7 0%, #fce7f3 33%, #e0e7ff 66%, #ddd6fe 100%)',
      paddingBottom: '4rem'
    }}>
      {/* En-tête magnifique */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
        padding: '3rem 1rem',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Effet de particules flottantes */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <Link 
            href="/dashboard" 
            style={{
              position: 'absolute',
              top: '-2rem',
              left: '0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.875rem',
              opacity: 0.9
            }}
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🌿 Relecture spirituelle
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            opacity: 0.95,
            marginBottom: '2rem',
            fontStyle: 'italic'
          }}>
            "Contemplez le fil d'or de l'action de Dieu dans votre vie"
          </p>
          
          {/* Stats rapides */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{entries.length}</span>
              <span style={{ marginLeft: '0.5rem' }}>moments notés</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{filteredEntries.length}</span>
              <span style={{ marginLeft: '0.5rem' }}>dans cette période</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Filtres élégants */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Filter size={20} style={{ color: '#6b7280' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Filtrer ma relecture</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>Période</label>
              <select 
                className="select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="1week">Cette semaine</option>
                <option value="1month">Ce mois</option>
                <option value="3months">3 derniers mois</option>
                <option value="6months">6 derniers mois</option>
                <option value="1year">Cette année</option>
                <option value="all">Tout voir</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>Types d'entrées</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedTypes(['all'])}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: selectedTypes.includes('all') ? '#7c3aed' : '#e5e7eb',
                    color: selectedTypes.includes('all') ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Tout
                </button>
                {['grace', 'priere', 'ecriture', 'parole', 'rencontre'].map(type => {
                  const config = getTypeConfig(type)
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        if (selectedTypes.includes('all')) {
                          setSelectedTypes([type])
                        } else if (selectedTypes.includes(type)) {
                          setSelectedTypes(selectedTypes.filter(t => t !== type))
                        } else {
                          setSelectedTypes([...selectedTypes, type])
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: 'none',
                        background: selectedTypes.includes(type) || selectedTypes.includes('all') ? config.color : '#e5e7eb',
                        color: selectedTypes.includes(type) || selectedTypes.includes('all') ? 'white' : '#6b7280',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions divines */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #e0e7ff)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowSuggestions(false)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              ×
            </button>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Lightbulb size={18} />
              L'Esprit souffle...
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                return (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '0.5rem',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Icon size={20} style={{ color: suggestion.color, flexShrink: 0 }} />
                    <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                      {suggestion.text}
                    </p>
                    {suggestion.action && (
                      <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#6b7280' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Timeline spirituelle */}
        <div style={{ position: 'relative' }}>
          {/* Ligne centrale */}
          {filteredEntries.length > 0 && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, #e5e7eb, #7c3aed, #e5e7eb)',
              transform: 'translateX(-50%)'
            }} />
          )}

          {/* Entrées */}
          {filteredEntries.map((entry, index) => {
            const config = getTypeConfig(entry.type)
            const Icon = config.icon
            const isExpanded = expandedEntry === entry.id
            const isLeft = index % 2 === 0

            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  marginBottom: '2rem',
                  position: 'relative'
                }}
              >
                {/* Connecteur */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '2rem',
                  width: '20px',
                  height: '20px',
                  background: config.gradient,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 4px white, 0 0 0 6px ' + config.color + '30',
                  zIndex: 1
                }} />

                {/* Carte */}
                <div 
                  style={{
                    width: '45%',
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                    marginRight: isLeft ? '2.5rem' : '0',
                    marginLeft: isLeft ? '0' : '2.5rem'
                  }}
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div style={{
                      background: config.gradient,
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'start',
                        marginBottom: '0.5rem'
                      }}>
                        <h4 style={{ 
                          color: '#1f2937', 
                          fontWeight: '600',
                          fontSize: '1rem'
                        }}>
                          {config.label}
                        </h4>
                        <time style={{ 
                          fontSize: '0.75rem', 
                          color: '#6b7280' 
                        }}>
                          {format(parseISO(entry.date), 'dd MMM', { locale: fr })}
                        </time>
                      </div>
                      
                      <p style={{ 
                        color: '#4b5563',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        marginBottom: isExpanded ? '1rem' : '0',
                        display: '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'none' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {entry.texte || entry.description || entry.sujet || entry.reference || 'Entrée'}
                      </p>
                      
                      {isExpanded && (
                        <div style={{
                          borderTop: '1px solid #e5e7eb',
                          paddingTop: '1rem',
                          marginTop: '1rem'
                        }}>
                          {entry.lieu && (
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              📍 {entry.lieu}
                            </p>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                              {entry.tags.map((tag: string, i: number) => (
                                <span 
                                  key={i}
                                  style={{
                                    background: config.color + '20',
                                    color: config.color,
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <Link
                            href={`/${entry.type}s/${entry.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: config.color,
                              fontSize: '0.875rem',
                              textDecoration: 'none',
                              marginTop: '0.5rem'
                            }}
                          >
                            <Eye size={14} />
                            Voir le détail
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message d'encouragement si vide */}
        {filteredEntries.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Sparkles size={48} style={{ 
              margin: '0 auto 1rem', 
              color: '#a855f7',
              opacity: 0.5
            }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Aucune entrée pour cette période
            </h3>
            <p style={{ color: '#6b7280' }}>
              Ajustez vos filtres ou commencez à noter les merveilles de Dieu !
            </p>
          </div>
        )}

        {/* Citation finale */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
            "Souviens-toi des merveilles qu'il a faites."
          </p>
          <p style={{ fontSize: '0.875rem' }}>Psaume 105, 5</p>
        </div>
      </div>
    </div>
  )
}