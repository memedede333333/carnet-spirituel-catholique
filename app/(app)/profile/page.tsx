'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Shield, Mail, Key, Calendar, ArrowLeft, Edit3 } from 'lucide-react'
import type { Profile } from '@/app/types'

export default function ProfilePage() {
  const getInitials = (prenom?: string, nom?: string) => {
    const p = prenom?.[0] || ''
    const n = nom?.[0] || ''
    return (p + n).toUpperCase() || '?'
  }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Erreur de chargement du profil</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête avec fond gris-bleu */}
        <div style={{
          background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#4338CA',
            textDecoration: 'none',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}>
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
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#312E81',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    background: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginRight: '1rem'
                  }}>
                    {getInitials(profile.prenom, profile.nom)}
                  </div>
                  Mon Profil
                </div>
              </h1>
              <p style={{ color: '#4338CA', opacity: 0.9 }}>
                Gérez vos informations personnelles et votre sécurité
              </p>
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Carte Informations personnelles */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            border: '2px solid transparent'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '2px solid #C7D2FE'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} style={{ color: '#4338CA' }} />
              </div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#312E81',
                margin: 0
              }}>
                Informations personnelles
              </h2>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Prénom
                  </p>
                  <p style={{ fontWeight: '500', color: '#1F2937' }}>{profile.prenom}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Nom
                  </p>
                  <p style={{ fontWeight: '500', color: '#1F2937' }}>{profile.nom || 'Non renseigné'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Email
                  </p>
                  <p style={{ fontWeight: '500', color: '#1F2937' }}>{profile.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Membre depuis
                  </p>
                  <p style={{ fontWeight: '500', color: '#1F2937' }}>
                    {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <Link href="/profile/edit" style={{
                background: '#C7D2FE',
                color: '#312E81',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                width: '100%',
                justifyContent: 'center'
              }}>
                <Edit3 size={18} />
                Modifier mes informations
              </Link>
            </div>
          </div>

          {/* Carte Sécurité */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            border: '2px solid transparent'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #E6EDFF, #D6E5F5)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '2px solid #D6E5F5'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={20} style={{ color: '#6366f1' }} />
              </div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#4338CA',
                margin: 0
              }}>
                Sécurité
              </h2>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/profile/password" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#F0F4FF',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D6E5F5'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
                >
                  <Key size={20} style={{ color: '#6366f1' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', color: '#1F2937', marginBottom: '0.25rem' }}>
                      Changer mon mot de passe
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Modifiez votre mot de passe de connexion
                    </p>
                  </div>
                </Link>

                <Link href="/profile/email" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#F0F4FF',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D6E5F5'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
                >
                  <Mail size={20} style={{ color: '#6366f1' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', color: '#1F2937', marginBottom: '0.25rem' }}>
                      Changer mon email
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Modifier votre adresse email
                    </p>
                  </div>
                </Link>

                <Link href="/profile/security" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#F0F4FF',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  border: '2px solid transparent',
                  marginTop: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D6E5F5'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
                >
                  <Shield size={20} style={{ color: '#6366f1' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', color: '#1F2937', marginBottom: '0.25rem' }}>
                      Historique de sécurité
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      Consultez votre historique de connexion
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
