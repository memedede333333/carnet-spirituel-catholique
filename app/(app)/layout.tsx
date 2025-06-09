'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Heart, BookOpen, MessageCircle, Users, Sparkles, LogOut, Menu, X, HandHeart, User } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  // Supabase importé depuis lib/supabase.ts
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [profile, setProfile] = useState<{ prenom: string; nom: string; email: string } | null>(null)

  // Charger le profil utilisateur
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('prenom, nom, email')
            .eq('id', user.id)
            .single()
          
          if (data) {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error)
      }
    }
    
    loadProfile()
  }, [])

  // Détection du mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fermer le menu quand on change de page sur mobile
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { href: '/dashboard', label: 'Tableau de bord', emoji: '🏠', color: '#8b5cf6' },
    { href: '/graces', label: 'Grâces reçues', emoji: '✨', color: '#fbbf24' },
    { href: '/prieres', label: 'Prières', emoji: '🙏', color: '#6366f1' },
    { href: '/ecritures', label: 'Écritures', emoji: '📖', color: '#10b981' },
    { href: '/paroles', label: 'Paroles', emoji: '🕊️', color: '#0ea5e9' },
    { href: '/rencontres', label: 'Rencontres', emoji: '🤝', color: '#f43f5e' },
    { href: '/relecture', label: 'Relecture', emoji: '🌿', color: '#7BA7E1' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Bouton menu mobile */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1100,
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            transition: 'all 0.3s ease'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '2px 0 20px rgba(0, 0, 0, 0.05)',
        position: isMobile ? 'fixed' : 'relative',
        height: isMobile ? '100vh' : 'auto',
        left: isMobile ? (isMobileMenuOpen ? 0 : '-280px') : 0,
        top: 0,
        zIndex: 1000,
        transition: 'left 0.3s ease',
        overflowY: 'auto'
      }}>
        {/* Header avec Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          {/* Logo Esprit Saint */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'white',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: '0 auto 1rem'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(224, 242, 254, 0.2), transparent)',
              animation: 'shimmer 3s ease-in-out infinite'
            }} />
            <Image 
              src="/logo-esprit-saint-web.png" 
              alt="Logo Esprit Saint" 
              width={60} 
              height={60}
              style={{
                objectFit: 'contain',
                zIndex: 1
              }}
              priority
            />
          </div>

          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2345',
            marginBottom: '0.75rem',
            fontFamily: 'Crimson Text, serif'
          }}>
            Carnet Spirituel
          </h1>
          
          {/* Profil cliquable */}
          <Link
            href="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(99, 102, 241, 0.05)',
              borderRadius: '2rem',
              textDecoration: 'none',
              color: '#4b5563',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div 
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <User size={16} style={{ color: '#6366f1' }} />
            </div>
            <span style={{ 
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px',
              display: 'inline-block'
            }}>
              {profile ? `${profile.prenom} ${profile.nom || ''}`.trim() : 'Chargement...'}
            </span>
          </Link>
          
          {profile?.email && (
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '0.5rem'
            }}>
              {profile.email}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive ? '#1f2345' : '#4b5563',
                  fontWeight: isActive ? '500' : '400',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  background: isActive ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                  animation: `fadeInLeft 0.6s ease-out both`,
                  animationDelay: `${index * 0.05}s`
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }
                }}
              >
                {/* Ligne active */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: item.color,
                    opacity: 0.6
                  }} />
                )}

                {/* Icône dans cercle */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${item.color}20, white)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    transition: 'transform 0.3s ease'
                  }}>
                    {item.emoji}
                  </span>
                </div>

                {/* Texte */}
                <span style={{
                  fontSize: '0.95rem',
                  letterSpacing: '0.01em'
                }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              width: '100%',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content - AUCUNE MODIFICATION ICI */}
      <main style={{ 
        flex: 1,
        paddingTop: isMobile ? '5rem' : 0
      }}>
        {children}
      </main>

      {/* Styles globaux pour les animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10%, 10%); }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
