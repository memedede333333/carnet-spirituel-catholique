import { useEffect, useRef, useState } from 'react'

interface ConstellationViewProps {
  entries: any[]
  links: any[]
  onEntryClick: (entry: any) => void
  getTypeConfig: (type: string) => any
}

export default function ConstellationView({ entries, links, onEntryClick, getTypeConfig }: ConstellationViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredEntry, setHoveredEntry] = useState<any>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })

  useEffect(() => {
    // Adapter la taille au conteneur
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ 
          width: Math.min(width - 40, 1200), 
          height: Math.min(window.innerHeight - 300, 700) 
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2
  const radius = Math.min(dimensions.width, dimensions.height) * 0.35

  // Calculer les positions des entrées en cercle
  const entryPositions = entries.map((entry, index) => {
    const angle = (index / entries.length) * 2 * Math.PI - Math.PI / 2
    return {
      ...entry,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle
    }
  })

  // Fonction pour trouver la position d'une entrée
  const findPosition = (id: string, type: string) => {
    return entryPositions.find(e => e.id === id && e.type === type)
  }

  // Obtenir le texte court pour l'entrée
  const getShortText = (entry: any) => {
    const text = entry.texte || entry.description || entry.sujet || entry.reference || 
                 (entry.type === 'priere' ? `${entry.personne_prenom}` : '')
    return text ? (text.length > 40 ? text.substring(0, 40) + '...' : text) : 'Entrée'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '1rem',
      minHeight: '650px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)',
        borderRadius: '0.75rem',
        padding: '1rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#D8B4FE', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
          ✨ Constellation spirituelle
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Cliquez sur les éléments pour voir leurs connexions • Survolez pour plus de détails
        </p>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block', margin: '0 auto' }}
      >
        <defs>
          {/* Gradients pour chaque type */}
          {['grace', 'priere', 'ecriture', 'parole', 'rencontre'].map(type => {
            const config = getTypeConfig(type)
            return (
              <linearGradient key={type} id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={config.color} stopOpacity="0.6" />
              </linearGradient>
            )
          })}
          
          {/* Gradient pour les liens */}
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D8B4FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.2" />
          </linearGradient>

          {/* Filtre pour l'effet de glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Cercle de fond */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 50}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
        />

        {/* Dessiner les liens */}
        {links.map((link, index) => {
          const source = findPosition(link.element_source_id, link.element_source_type)
          const target = findPosition(link.element_cible_id, link.element_cible_type)
          
          if (!source || !target) return null
          
          const isHovered = hoveredEntry && (
            (hoveredEntry.id === source.id && hoveredEntry.type === source.type) ||
            (hoveredEntry.id === target.id && hoveredEntry.type === target.type)
          )
          
          return (
            <g key={link.id}>
              <path
                d={`M ${source.x} ${source.y} Q ${centerX} ${centerY} ${target.x} ${target.y}`}
                fill="none"
                stroke={isHovered ? "#D8B4FE" : "url(#linkGradient)"}
                strokeWidth={isHovered ? "3" : "2"}
                opacity={isHovered ? "0.8" : "0.4"}
                style={{
                  transition: 'all 0.3s ease'
                }}
              />
              {/* Type de lien au milieu */}
              {isHovered && (
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2}
                  textAnchor="middle"
                  fill="#D8B4FE"
                  fontSize="10"
                  fontWeight="500"
                  style={{
                    background: 'white',
                    padding: '2px 4px',
                    borderRadius: '4px'
                  }}
                >
                  {link.type_lien === 'exauce' ? 'Exaucé' :
                   link.type_lien === 'accomplit' ? 'Accompli' :
                   link.type_lien === 'decoule' ? 'Découle' :
                   link.type_lien === 'eclaire' ? 'Éclaire' : 'Écho'}
                </text>
              )}
            </g>
          )
        })}

        {/* Dessiner les nœuds */}
        {entryPositions.map((entry, index) => {
          const config = getTypeConfig(entry.type)
          const hasLinks = links.some(l => 
            (l.element_source_id === entry.id && l.element_source_type === entry.type) ||
            (l.element_cible_id === entry.id && l.element_cible_type === entry.type)
          )
          const isHovered = hoveredEntry?.id === entry.id
          
          return (
            <g 
              key={entry.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onEntryClick(entry)}
              onMouseEnter={() => setHoveredEntry(entry)}
              onMouseLeave={() => setHoveredEntry(null)}
            >
              {/* Halo pour les éléments avec liens */}
              {(hasLinks || isHovered) && (
                <circle
                  cx={entry.x}
                  cy={entry.y}
                  r={isHovered ? 45 : 35}
                  fill={config.color}
                  opacity={isHovered ? 0.3 : 0.15}
                  filter="url(#glow)"
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                />
              )}
              
              {/* Cercle principal */}
              <circle
                cx={entry.x}
                cy={entry.y}
                r={isHovered ? 35 : hasLinks ? 30 : 25}
                fill={`url(#gradient-${entry.type})`}
                stroke="white"
                strokeWidth="3"
                filter={isHovered ? "url(#glow)" : "none"}
                style={{
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: `${entry.x}px ${entry.y}px`
                }}
              />
              
              {/* Emoji du type */}
              <text
                x={entry.x}
                y={entry.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {entry.type === 'grace' ? '✨' :
                 entry.type === 'priere' ? '🙏' :
                 entry.type === 'ecriture' ? '📖' :
                 entry.type === 'parole' ? '💬' : '🤝'}
              </text>
              
              {/* Date sous le cercle */}
              <text
                x={entry.x}
                y={entry.y + 50}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
                fontWeight="500"
              >
                {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </text>
              
              {/* Nombre de liens */}
              {entry.linksCount > 0 && (
                <>
                  <circle
                    cx={entry.x + 25}
                    cy={entry.y - 20}
                    r="12"
                    fill="#E9D5FF"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={entry.x + 25}
                    y={entry.y - 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {entry.linksCount}
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Tooltip au survol */}
        {hoveredEntry && (
          <foreignObject
            x={hoveredEntry.x - 120}
            y={hoveredEntry.y + 60}
            width="240"
            height="100"
          >
            <div style={{
              background: 'white',
              border: `2px solid ${getTypeConfig(hoveredEntry.type).color}`,
              borderRadius: '0.5rem',
              padding: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '0.813rem'
            }}>
              <div style={{
                fontWeight: '600',
                color: getTypeConfig(hoveredEntry.type).color,
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {hoveredEntry.type === 'grace' ? '✨ Grâce' :
                 hoveredEntry.type === 'priere' ? '🙏 Prière' :
                 hoveredEntry.type === 'ecriture' ? '📖 Écriture' :
                 hoveredEntry.type === 'parole' ? '💬 Parole' : '🤝 Rencontre'}
              </div>
              <div style={{ color: '#4b5563', lineHeight: '1.4' }}>
                {getShortText(hoveredEntry)}
              </div>
              {hoveredEntry.lieu && (
                <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  📍 {hoveredEntry.lieu}
                </div>
              )}
            </div>
          </foreignObject>
        )}
      </svg>

      {/* Légende interactive */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#f9fafb',
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Types</div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['grace', 'priere', 'ecriture', 'parole', 'rencontre'].map(type => {
              const config = getTypeConfig(type)
              const count = entries.filter(e => e.type === type).length
              return (
                <div key={type} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  padding: '0.25rem 0.75rem',
                  background: 'white',
                  borderRadius: '9999px',
                  border: `1px solid ${config.color}20`
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: config.color
                  }} />
                  <span style={{ fontSize: '0.813rem', color: '#4b5563' }}>
                    {config.label} ({count})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Liens spirituels</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries({
              'exauce': '✨ Exaucé',
              'accomplit': '✓ Accompli',
              'decoule': '🌱 Découle',
              'eclaire': '💡 Éclaire',
              'echo': '🔗 Écho'
            }).map(([type, label]) => (
              <div key={type} style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280',
                padding: '0.25rem 0.5rem',
                background: 'white',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '2px',
                  background: '#E9D5FF'
                }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
