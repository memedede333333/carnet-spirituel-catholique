'use client'

import { LinkIcon } from 'lucide-react'

interface LinkBadgeProps {
  count: number
  color?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

export default function LinkBadge({ count, color = '#6366f1', size = 'small', onClick }: LinkBadgeProps) {
  if (count === 0) return null

  const sizeStyles = {
    small: {
      width: '28px',
      height: '28px',
      fontSize: '0.75rem',
      top: '-8px',
      right: '-8px'
    },
    medium: {
      width: '36px',
      height: '36px',
      fontSize: '0.875rem',
      top: '-10px',
      right: '-10px'
    },
    large: {
      width: '44px',
      height: '44px',
      fontSize: '1rem',
      top: '-12px',
      right: '-12px'
    }
  }

  const style = sizeStyles[size]

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: style.top,
        right: style.right,
        width: style.width,
        height: style.height,
        borderRadius: '50%',
        background: 'white',
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: style.fontSize,
        fontWeight: '600',
        color: color,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        zIndex: 10
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }}
      title={`${count} lien${count > 1 ? 's' : ''} spirituel${count > 1 ? 's' : ''}`}
    >
      <span style={{ fontSize: '0.875rem', marginRight: '2px' }}>🔗</span>
      <span style={{ fontSize: style.fontSize }}>{count}</span>
    </div>
  )
}
