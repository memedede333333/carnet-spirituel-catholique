'use client'
import { useState, useEffect } from 'react'
import { differenceInDays } from 'date-fns'

interface RappelsDouxProps {
  entries: any[]
  onAction?: (action: string, data?: any) => void
}

export default function RappelsDoux({ entries, onAction }: RappelsDouxProps) {
  const [rappel, setRappel] = useState<{ emoji: string; text: string; color: string; action: string; data?: any } | null>(null)
  
  useEffect(() => {
    // Chercher les prières anciennes (plus de 90 jours)
    const now = new Date()
    const oldPrayers = entries.filter(e => 
      e.type === 'priere' && 
      differenceInDays(now, new Date(e.date)) > 90
    )
    
    // 30% de chance d'afficher un rappel
    if (oldPrayers.length > 0 && Math.random() < 0.3) {
      const prayer = oldPrayers[Math.floor(Math.random() * oldPrayers.length)]
      setRappel({
        emoji: "🙏",
        text: `${prayer.personne_prenom}, pour qui tu as prié, traverse peut-être ton esprit aujourd'hui...`,
        color: '#6366f1',
        action: 'Prendre des nouvelles',
        data: prayer
      })
    }
  }, [entries])
  
  if (!rappel) return null
  
  return (
    <div style={{
      background: rappel.color,
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'fadeIn 0.5s ease-in'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{rappel.emoji}</span>
        <span>{rappel.text}</span>
      </div>
      {onAction && rappel.action && (
        <button
          onClick={() => onAction(rappel.action, rappel.data)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          {rappel.action}
        </button>
      )}
    </div>
  )
} 