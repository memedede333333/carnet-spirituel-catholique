'use client'
import { useState } from 'react'
import { LinkIcon, ChevronUp, ChevronDown } from 'lucide-react'

interface WidgetLiensRecentsProps {
  recentLinks: any[]
  entries: any[]
  getEntryText: (entry: any) => string
  getTypeConfig: (type: string) => any
}

export default function WidgetLiensRecents({
  recentLinks,
  entries,
  getEntryText,
  getTypeConfig
}: WidgetLiensRecentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Prendre les 5 derniers liens
  const displayLinks = recentLinks.slice(-5).reverse()
  
  if (displayLinks.length === 0) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 900
    }}>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: '#7BA7E1',
          color: 'white',
          border: 'none',
          borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        <LinkIcon size={16} />
        <span>{displayLinks.length} liens récents</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      
      {/* Contenu */}
      {isOpen && (
        <div style={{
          background: 'white',
          border: '2px solid #7BA7E1',
          borderTop: 'none',
          borderRadius: '0 0 0.5rem 0.5rem',
          padding: '1rem',
          maxWidth: '300px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {displayLinks.map((link, index) => {
              const sourceEntry = entries.find(e => e.id === link.element_source_id)
              const targetEntry = entries.find(e => e.id === link.element_cible_id)
              
              if (!sourceEntry || !targetEntry) return null
              
              const sourceConfig = getTypeConfig(sourceEntry.type)
              const targetConfig = getTypeConfig(targetEntry.type)
              
              return (
                <div
                  key={link.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <span>{sourceConfig.emoji}</span>
                  <span style={{
                    background: '#E6EDFF',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.625rem',
                    whiteSpace: 'nowrap'
                  }}>
                    {link.type_lien}
                  </span>
                  <span>{targetConfig.emoji}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 