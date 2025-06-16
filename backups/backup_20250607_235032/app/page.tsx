'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  
  const biblicalQuotes = [
    { text: "Allez dans le monde entier. Proclamez l'Évangile à toute la création.", reference: "Marc 16, 15" },
    { text: "Vous serez mes témoins à Jérusalem, dans toute la Judée et la Samarie, et jusqu'aux extrémités de la terre.", reference: "Actes 1, 8" },
    { text: "Comme le Père m'a envoyé, moi aussi je vous envoie.", reference: "Jean 20, 21" },
    { text: "La moisson est abondante, mais les ouvriers sont peu nombreux.", reference: "Matthieu 9, 37" },
    { text: "Ce que vous avez reçu gratuitement, donnez-le gratuitement.", reference: "Matthieu 10, 8" },
    { text: "Je suis venu pour qu'ils aient la vie, et qu'ils l'aient en abondance.", reference: "Jean 10, 10" },
    { text: "Soyez toujours prêts à rendre compte de l'espérance qui est en vous.", reference: "1 Pierre 3, 15" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % biblicalQuotes.length)
    }, 6000) // Change toutes les 6 secondes
    
    return () => clearInterval(interval)
  }, [])

  const modules = [
    {
      href: '/login',
      icon: '✨',
      title: 'Grâces reçues',
      description: 'Notez les grâces que vous recevez au quotidien',
      color: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      href: '/login',
      icon: '🙏',
      title: 'Prières',
      description: 'Suivez vos intentions de prière et leurs fruits',
      color: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700'
    },
    {
      href: '/login',
      icon: '📖',
      title: 'Paroles d\'Écriture',
      description: 'Gardez les textes bibliques qui vous touchent',
      color: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      href: '/login',
      icon: '🕊️',
      title: 'Paroles de connaissance',
      description: 'Notez les paroles reçues et leur accomplissement',
      color: 'from-sky-50 to-blue-50',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700'
    },
    {
      href: '/login',
      icon: '🤝',
      title: 'Rencontres missionnaires',
      description: 'Suivez vos rencontres d\'évangélisation',
      color: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700'
    },
    {
      href: '/login',
      icon: '🌿',
      title: 'Relecture spirituelle',
      description: 'Contemplez le fil rouge de l\'action de Dieu',
      color: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    }
  ]

  return (
    <div className="dashboard-container" style={{ paddingBottom: '6rem' }}>
      {/* Boutons de connexion en haut à droite */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10
      }}>
        <Link 
          href="/login" 
          className="btn btn-secondary"
          style={{ fontSize: '0.875rem' }}
        >
          Se connecter
        </Link>
        <Link 
          href="/register" 
          className="btn btn-primary"
          style={{ fontSize: '0.875rem' }}
        >
          S'inscrire
        </Link>
      </div>

      <div className="dashboard-header fade-in">
        <h1 className="dashboard-title">Carnet de grâces & de missions</h1>
        <p className="dashboard-subtitle">
          Contemplez l'action de Dieu dans votre vie
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link
            key={module.title}
            href={module.href}
            className="module-card fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`module-gradient ${module.color}`}>
              <div className="module-icon-wrapper">
                <span className="module-icon">{module.icon}</span>
              </div>
            </div>
            <div className="module-content">
              <h3 className={`module-title ${module.textColor}`}>
                {module.title}
              </h3>
              <p className="module-description">
                {module.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Section explicative */}
      <div style={{
        maxWidth: '800px',
        margin: '4rem auto 3rem',
        textAlign: 'center',
        padding: '0 1rem'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Un compagnon pour votre vie spirituelle
        </h2>
        <p style={{
          color: '#6b7280',
          lineHeight: '1.8',
          fontSize: '1.1rem'
        }}>
          Ce carnet vous accompagne dans votre chemin de foi en gardant trace des moments où Dieu agit. 
          Notez vos grâces, priez pour vos frères, méditez la Parole, et relisez votre histoire sainte 
          pour y découvrir le fil d'or de la Providence.
        </p>
      </div>

      {/* Carrousel de citations bibliques */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
        padding: '3rem 1rem',
        marginTop: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {biblicalQuotes.map((quote, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '100%',
                opacity: currentQuoteIndex === index ? 1 : 0,
                transform: `translateY(${currentQuoteIndex === index ? 0 : '20px'})`,
                transition: 'all 1s ease-in-out'
              }}
            >
              <p style={{
                fontSize: '1.5rem',
                fontStyle: 'italic',
                color: '#4c1d95',
                marginBottom: '0.75rem',
                fontWeight: '300'
              }}>
                « {quote.text} »
              </p>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {quote.reference}
              </p>
            </div>
          ))}
        </div>
        
        {/* Indicateurs de progression */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {biblicalQuotes.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentQuoteIndex === index ? '#6366f1' : '#e5e7eb',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-footer fade-in" style={{ marginTop: '3rem' }}>
        <p className="spiritual-quote">
          « Que notre cœur se tourne vers le Seigneur » - Saint Augustin
        </p>
      </div>
    </div>
  )
}