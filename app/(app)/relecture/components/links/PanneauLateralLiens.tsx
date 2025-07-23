'use client'
import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface PanneauLateralLiensProps {
  isOpen: boolean
  onClose: () => void
  sourceEntry: any
  allEntries: any[]
  onCreateLink: (source: any, destination: any, linkType: string) => void
  getEntryText: (entry: any) => string
  getTypeConfig: (type: string) => any
}

export default function PanneauLateralLiens({
  isOpen,
  onClose,
  sourceEntry,
  allEntries,
  onCreateLink,
  getEntryText,
  getTypeConfig
}: PanneauLateralLiensProps) {
  const [selectedType, setSelectedType] = useState('exauce')
  const [selectedDest, setSelectedDest] = useState<any>(null)
  const [filterText, setFilterText] = useState('')
  const [filterType, setFilterType] = useState('all')
  
  // IMPORTANT : Garder la même logique de filtrage que l'actuel
  // mais SANS les suggestions automatiques
  
  const filteredEntries = allEntries
    .filter(e => e.id !== sourceEntry?.id)
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e => getEntryText(e).toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime())
  
  return (
    <>
      {/* Overlay sombre */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
          onClick={onClose}
        />
      )}
      
      {/* Panneau */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: '400px',
        maxWidth: '100vw',
        height: '100vh',
        background: 'white',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.3s ease',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>
            Créer une connexion spirituelle
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>
        
        {/* Corps du panneau */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.5rem'
        }}>
          {/* Source */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Depuis :
            </label>
            <div style={{
              background: '#f9fafb',
              border: '2px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              {sourceEntry && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {getTypeConfig(sourceEntry.type).emoji}
                    </span>
                    <span style={{ fontWeight: '600', color: getTypeConfig(sourceEntry.type).color }}>
                      {getTypeConfig(sourceEntry.type).label}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                    {getEntryText(sourceEntry).substring(0, 100)}...
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* Type de lien */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Type de connexion :
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem'
            }}>
              {[
                { value: 'exauce', emoji: '🙏', label: 'Exauce' },
                { value: 'accomplit', emoji: '✓', label: 'Accomplit' },
                { value: 'decoule', emoji: '→', label: 'Découle' },
                { value: 'eclaire', emoji: '💡', label: 'Éclaire' },
                { value: 'echo', emoji: '🔄', label: 'Fait écho' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid',
                    borderColor: selectedType === type.value ? '#7BA7E1' : '#e5e7eb',
                    background: selectedType === type.value ? '#E6EDFF' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{type.emoji}</span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: selectedType === type.value ? '600' : '400'
                  }}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Destination */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Vers :
            </label>
            
            {/* Filtres */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tous types</option>
                <option value="grace">✨ Grâces</option>
                <option value="priere">🙏 Prières</option>
                <option value="ecriture">📖 Écritures</option>
                <option value="parole">🕊️ Paroles</option>
                <option value="rencontre">🤝 Rencontres</option>
              </select>
            </div>
            
            {/* Liste des entrées */}
            <div style={{
              maxHeight: '300px',
              overflow: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}>
              {filteredEntries.length === 0 ? (
                <p style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  Aucune entrée trouvée
                </p>
              ) : (
                filteredEntries.map(entry => {
                  const config = getTypeConfig(entry.type)
                  const isSelected = selectedDest?.id === entry.id
                  
                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedDest(entry)}
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        background: isSelected ? '#E6EDFF' : 'white',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#f9fafb'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'white'
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>
                          {config.emoji}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#1f2937'
                          }}>
                            {getEntryText(entry).substring(0, 80)}...
                          </p>
                          <p style={{
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            {new Date(entry.date || entry.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        {isSelected && (
                          <span style={{
                            color: '#7BA7E1',
                            fontSize: '1.25rem'
                          }}>
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Footer avec bouton */}
        <div style={{
          padding: '1.5rem',
          borderTop: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => {
              if (selectedDest) {
                onCreateLink(sourceEntry, selectedDest, selectedType)
                onClose()
              }
            }}
            disabled={!selectedDest}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: selectedDest ? '#7BA7E1' : '#e5e7eb',
              color: selectedDest ? 'white' : '#9ca3af',
              fontWeight: '600',
              cursor: selectedDest ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            Créer cette connexion spirituelle
          </button>
        </div>
      </div>
    </>
  )
} 