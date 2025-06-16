'use client'

import Link from 'next/link'

export default function DashboardPage() {
  const modules = [
    {
      href: '/graces',
      icon: '✨',
      title: 'Grâces reçues',
      description: 'Notez les grâces que vous recevez au quotidien',
      color: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      href: '/prieres',
      icon: '🙏',
      title: 'Prières',
      description: 'Suivez vos intentions de prière et leurs fruits',
      color: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700'
    },
    {
      href: '/ecritures',
      icon: '📖',
      title: 'Paroles d\'Écriture',
      description: 'Gardez les textes bibliques qui vous touchent',
      color: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      href: '/paroles',
      icon: '🕊️',
      title: 'Paroles de connaissance',
      description: 'Notez les paroles reçues et leur accomplissement',
      color: 'from-sky-50 to-blue-50',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700'
    },
    {
      href: '/rencontres',
      icon: '🤝',
      title: 'Rencontres missionnaires',
      description: 'Suivez vos rencontres d\'évangélisation',
      color: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700'
    },
    {
      href: '/relecture',
      icon: '🌿',
      title: 'Relecture spirituelle',
      description: 'Contemplez le fil rouge de l\'action de Dieu',
      color: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    }
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header fade-in">
        <h1 className="dashboard-title">Carnet de grâces & de missions</h1>
        <p className="dashboard-subtitle">
          Contemplez l'action de Dieu dans votre vie
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link
            key={module.href}
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

      <div className="dashboard-footer fade-in">
        <p className="spiritual-quote">
          « Que notre cœur se tourne vers le Seigneur » - Saint Augustin
        </p>
      </div>
    </div>
  )
}