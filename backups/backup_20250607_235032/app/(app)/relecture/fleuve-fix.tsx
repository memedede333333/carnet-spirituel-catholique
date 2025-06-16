// Remplacer la section Vue Fleuve de vie dans le fichier relecture/page.tsx
// Ligne environ 1156-1254

        {/* Vue Fleuve de vie */}
        {viewMode === 'fleuve' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #e0e7ff, #ddd6fe)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>Le Fleuve de Vie</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Visualisez le cours de votre vie spirituelle, comme un fleuve qui s'écoule dans le temps.
                Chaque moment est une goutte d'eau qui rejoint le courant de la grâce divine.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              minHeight: '600px',
              position: 'relative',
              overflow: 'visible'
            }}>
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 0
                }}
                viewBox="0 0 1200 600"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="fleuveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 300 Q 300 ${250 + Math.sin(Date.now() / 1000) * 30} 600 300 T 1200 300`}
                  fill="none"
                  stroke="url(#fleuveGradient)"
                  strokeWidth="150"
                />
              </svg>
              
              {filteredEntries.map((entry, index) => {
                const config = getTypeConfig(entry.type)
                const Icon = config.icon
                const position = (index / (filteredEntries.length - 1 || 1)) * 85 + 7.5
                const yOffset = Math.sin(index * 0.8) * 100
                const isSelected = firstSelectedEntry?.id === entry.id
                
                return (
                  <div
                    key={entry.id}
                    style={{
                      position: 'absolute',
                      left: `${position}%`,
                      top: `${50 + yOffset}%`,
                      transform: 'translate(-50%, -50%)',
                      background: 'white',
                      borderRadius: '1rem',
                      padding: '1.75rem',
                      boxShadow: isSelected ? `0 0 0 4px ${config.color}` : '0 8px 16px rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: isSelected ? 20 : 1,
                      minWidth: '280px',
                      maxWidth: '320px',
                      border: `2px solid ${isSelected ? config.color : 'transparent'}`,
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.05) translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                        zIndex: 15
                      }
                    }}
                    onClick={() => handleLinkClick(entry)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05) translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)'
                      e.currentTarget.style.zIndex = '15'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(-50%, -50%)'
                      e.currentTarget.style.boxShadow = isSelected ? `0 0 0 4px ${config.color}` : '0 8px 16px rgba(0, 0, 0, 0.15)'
                      e.currentTarget.style.zIndex = isSelected ? '20' : '1'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        background: config.gradient,
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <Icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: config.color,
                          margin: '0 0 0.25rem 0',
                          lineHeight: '1.2'
                        }}>
                          {config.label}
                        </p>
                        <time style={{
                          fontSize: '0.813rem',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          {format(parseISO(entry.date), 'dd MMMM yyyy', { locale: fr })}
                        </time>
                      </div>
                    </div>
                    <p style={{
                      fontSize: '0.938rem',
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {getEntryText(entry)}
                    </p>
                    {entry.lieu && (
                      <p style={{
                        fontSize: '0.813rem',
                        color: '#9ca3af',
                        marginTop: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        📍 {entry.lieu}
                      </p>
                    )}
                    {linkMode && (
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          fontSize: '0.813rem',
                          color: '#7c3aed',
                          fontWeight: '500'
                        }}>
                          {firstSelectedEntry?.id === entry.id ? '✓ Sélectionné' : 'Cliquer pour relier'}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}