'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Calendar, MapPin, User, Users, Heart, Edit, Trash2, ArrowLeft, Clock, LinkIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import LinksList from '@/app/components/LinksList'
import { loadUserSpiritualLinks } from '@/app/lib/spiritual-links-helpers'

interface Rencontre {
  id: string
  personne_prenom: string
  personne_nom: string | null
  lieu: string
  date: string
  contexte: string
  description: string
  fruit_immediat: string | null
  fruit_espere: string | null
  visibilite: string
  created_at: string
  updated_at: string | null
}

const contexteLabels: Record<string, string> = {
  rue: 'Dans la rue',
  paroisse: 'À la paroisse',
  mission: 'En mission',
  travail: 'Au travail',
  quotidien: 'Vie quotidienne',
  autre: 'Autre'
}

export default function RencontreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [rencontre, setRencontre] = useState<Rencontre | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [spiritualLinks, setSpiritualLinks] = useState<any[]>([])
  const [allEntries, setAllEntries] = useState<any[]>([])

  useEffect(() => {
    fetchRencontre()
  }, [resolvedParams.id])

  const fetchRencontre = async () => {
    try {
      const { data, error } = await supabase
        .from('rencontres_missionnaires')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setRencontre(data)
      
      // Charger les liens spirituels
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) {
        loadUserSpiritualLinks(user.id).then(setSpiritualLinks)
        loadAllEntries(user.id).then(setAllEntries)
      }
    } catch (error) {
      console.error('Erreur:', error)
      router.push('/rencontres')
    } finally {
      setLoading(false)
    }
  }

  const loadAllEntries = async (userId: string) => {
    const allEntriesData: any[] = []
    
    const tables = [
      { name: 'graces', type: 'grace' },
      { name: 'prieres', type: 'priere' },
      { name: 'paroles_ecriture', type: 'ecriture' },
      { name: 'paroles_connaissance', type: 'parole' },
      { name: 'rencontres_missionnaires', type: 'rencontre' }
    ]
    
    for (const table of tables) {
      const { data } = await supabase
        .from(table.name)
        .select('*')
        .eq('user_id', userId)
      
      if (data) {
        allEntriesData.push(...data.map(item => ({ ...item, type: table.type })))
      }
    }
    
    return allEntriesData
  }

  const handleDelete = async () => {
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
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            background: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 2px 4px rgba(198, 93, 0, 0.2)',
            margin: '0 auto 1rem'
          }}>
            🤝
          </div>
          <p style={{ color: '#451A03' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!rencontre) return null

  return (
    <div style={{
      minHeight: '100vh',      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* En-tête rose pastel */}
          <div style={{
            background: 'linear-gradient(135deg, #FED7AA, #FDBA74)',
            padding: '2rem',
            color: '#451A03'
          }}>
            {/* Bouton retour vers le module */}
            <Link href="/rencontres" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#451A03',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}>
              <ArrowLeft size={16} />
              Retour aux rencontres
            </Link>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '50%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  boxShadow: '0 2px 4px rgba(198, 93, 0, 0.2)'
                }}>
                  <Users size={28} style={{ color: '#451A03' }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {rencontre.personne_prenom} {rencontre.personne_nom || ''}
                  </h1>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.8
                  }}>
                    {contexteLabels[rencontre.contexte] || rencontre.contexte}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <Link
                  href={`/rencontres/${rencontre.id}/modifier`}
                  style={{
                    background: 'white',
                    color: '#451A03',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  title="Modifier"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    background: 'white',
                    color: '#EF4444',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            {/* Description */}
            <div style={{
              background: '#FFF7ED',
              border: '2px solid #FED7AA',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#451A03',
                marginBottom: '0.75rem'
              }}>
                Description de la rencontre
              </h3>
              <p style={{
                color: '#1F2937',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {rencontre.description}
              </p>
            </div>

            {/* Informations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#FFF7ED',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#92400E'
                }}>
                  <Calendar size={20} />
                  <span style={{ fontWeight: '500' }}>Date</span>
                </div>
                <p style={{ color: '#451A03', fontSize: '1.125rem' }}>
                  {format(new Date(rencontre.date), 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <div style={{
                background: '#FFF7ED',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#92400E'
                }}>
                  <MapPin size={20} />
                  <span style={{ fontWeight: '500' }}>Lieu</span>
                </div>
                <p style={{ color: '#451A03', fontSize: '1.125rem' }}>
                  {rencontre.lieu}
                </p>
              </div>

              <div style={{
                background: '#FFF7ED',
                borderRadius: '0.75rem',
                padding: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#92400E'
                }}>
                  <Clock size={20} />
                  <span style={{ fontWeight: '500' }}>Ajouté</span>
                </div>
                <p style={{ color: '#451A03', fontSize: '1.125rem' }}>
                  {format(new Date(rencontre.created_at), 'd MMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>

            {/* Fruits */}
            {(rencontre.fruit_immediat || rencontre.fruit_espere) && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#451A03',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Heart size={20} />
                  Fruits de la rencontre
                </h3>
                
                {rencontre.fruit_immediat && (
                  <div style={{
                    background: '#FFFBEB',
                    border: '1px solid #FEF3C7',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#78350F',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Fruit immédiat
                    </h4>
                    <p style={{
                      color: '#92400E',
                      lineHeight: '1.5'
                    }}>
                      {rencontre.fruit_immediat}
                    </p>
                  </div>
                )}

                {rencontre.fruit_espere && (
                  <div style={{
                    background: '#F0F4FF',
                    border: '1px solid #E0E7FF',
                    borderRadius: '0.75rem',
                    padding: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#312E81',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Fruit espéré
                    </h4>
                    <p style={{
                      color: '#4C1D95',
                      lineHeight: '1.5'
                    }}>
                      {rencontre.fruit_espere}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions suggérées */}
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#FFF7ED',
              borderRadius: '0.75rem',
              border: '2px dashed #FED7AA'
            }}>
              <p style={{
                color: '#92400E',
                marginBottom: '1rem',
                fontSize: '1.125rem'
              }}>
                Avez-vous des nouvelles de {rencontre.personne_prenom} ?
              </p>
              <Link
                href={`/rencontres/${rencontre.id}/modifier`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#C65D00',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D97706'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C65D00'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Edit size={20} />
                Ajouter un suivi
              </Link>
            </div>

            {/* Citation en bas */}
            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: '#FFF7ED',
              borderRadius: '0.75rem',
              textAlign: 'center',
              borderLeft: '4px solid #C65D00'
            }}>
              <p style={{
                fontSize: '1rem',
                color: '#451A03',
                fontStyle: 'italic',
                marginBottom: '0.5rem'
              }}>
                « J'étais un étranger, et vous m'avez accueilli. »
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#92400E'
              }}>
                Matthieu 25, 35
              </p>
            </div>
          </div>
        </div>

        {/* Section Connexions spirituelles */}
        {spiritualLinks.filter(link =>
          link.element_source_id === rencontre.id ||
          link.element_cible_id === rencontre.id
        ).length > 0 && (
          <>
            {/* Espace de respiration */}
            <div style={{ height: '2rem' }} />
            
            {/* Container connexions */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(198, 93, 0, 0.1)'
              }}>
                {/* Barre supérieure décorative */}
                <div style={{
                  height: '4px',
                  background: 'linear-gradient(90deg, #FED7AA 0%, #FDBA74 50%, #FED7AA 100%)'
                }} />
                
                <div style={{
                  padding: '1.5rem',
                  background: '#FFF7ED'
                }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600',
                    color: '#451A03',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🔗 Connexions spirituelles
                  </h3>
                  
                  <LinksList 
                    entryId={rencontre.id}
                    links={spiritualLinks}
                    entries={allEntries}
                    onViewEntry={(entryId) => {
                      const entry = allEntries.find(e => e.id === entryId)
                      if (entry) {
                        router.push(`/${entry.type}s/${entry.id}`)
                      }
                    }}
                    onDeleteLink={async (linkId) => {
                      const { error } = await supabase
                        .from('liens_spirituels')
                        .delete()
                        .eq('id', linkId)
                      
                      if (!error) {
                        const { data: { user } } = await supabase.auth.getUser()
                        if (user?.id) {
                          const updatedLinks = await loadUserSpiritualLinks(user.id)
                          setSpiritualLinks(updatedLinks)
                        }
                      }
                    }}
                  />
                  
                  <button 
                    onClick={() => router.push(`/relecture?mode=atelier&source=${rencontre.id}&sourceType=rencontre`)}
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1.5rem',
                      background: '#C65D00',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#D97706'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(198, 93, 0, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#C65D00'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <LinkIcon size={16} />
                    Créer une nouvelle connexion
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}