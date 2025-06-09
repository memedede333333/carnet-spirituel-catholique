#!/bin/bash

echo '🎨 HARMONISATION COMPLÈTE DES 3 MODULES'
echo '======================================'

# 1. CRÉER PAGE DÉTAIL ÉCRITURES
echo '\n📖 Création page détail Écritures...'
cat > "app/(app)/ecritures/[id]/page.tsx" << 'EOFFILE'
'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2, BookOpen, Heart, Calendar, Target } from 'lucide-react'
import type { ParoleEcriture } from '@/app/types'

export default function DetailEcriture({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [ecriture, setEcriture] = useState<ParoleEcriture | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchEcriture()
  }, [resolvedParams.id])

  async function fetchEcriture() {
    try {
      const { data, error } = await supabase
        .from('paroles_ecriture')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      setEcriture(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette écriture ?')) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('paroles_ecriture')
        .delete()
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push('/ecritures')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!ecriture) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p>Écriture non trouvée</p>
            <Link href="/ecritures" className="btn btn-secondary">Retour</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/ecritures" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Retour aux écritures
          </Link>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* En-tête coloré */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  <BookOpen style={{ display: 'inline', marginRight: '0.5rem' }} size={24} />
                  {ecriture.reference}
                </h1>
                <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                  <Calendar style={{ display: 'inline', marginRight: '0.25rem' }} size={16} />
                  {new Date(ecriture.date_reception).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  href={`/ecritures/${ecriture.id}/modifier`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    transition: 'background 0.2s',
                    ':hover': { background: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  <Pencil size={16} />
                  Modifier
                </Link>
                <button 
                  onClick={handleDelete}
                  style={{
                    background: 'rgba(239, 68, 68, 0.8)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
                Texte biblique
              </h3>
              <div style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                fontStyle: 'italic',
                color: '#4b5563',
                borderLeft: '4px solid #10b981'
              }}>
                {ecriture.texte_complet}
              </div>
              {ecriture.traduction && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Traduction : {ecriture.traduction}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
                Contexte de réception
              </h3>
              <p style={{ color: '#4b5563' }}>{ecriture.contexte}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem', 
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Heart size={20} color="#ef4444" />
                Ce qui m'a touché
              </h3>
              <p style={{ color: '#4b5563' }}>{ecriture.ce_qui_ma_touche}</p>
            </div>

            {ecriture.pour && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Target size={20} color="#6366f1" />
                  Pour qui ?
                </h3>
                <p style={{ color: '#4b5563' }}>{ecriture.pour}</p>
              </div>
            )}

            {ecriture.fruits && ecriture.fruits.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
                  Fruits spirituels
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ecriture.fruits.map((fruit, index) => (
                    <span 
                      key={index} 
                      style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                      }}
                    >
                      {fruit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Citation en bas */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            "Ta parole est une lampe à mes pieds, une lumière sur ma route."
          </p>
          <p style={{ fontSize: '0.875rem' }}>Psaume 119, 105</p>
        </div>
      </div>
    </div>
  )
}
EOFFILE

# 2. CRÉER PAGE MODIFIER ÉCRITURES
echo '\n✏️ Création page modifier Écritures...'
cat > "app/(app)/ecritures/[id]/modifier/page.tsx" << 'EOFFILE'
'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { ParoleEcriture } from '@/app/types'

export default function ModifierEcriture({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    reference: '',
    texte_complet: '',
    traduction: 'TOB',
    contexte: 'messe',
    ce_qui_ma_touche: '',
    pour: '',
    fruits: [] as string[],
    newFruit: ''
  })

  useEffect(() => {
    fetchEcriture()
  }, [resolvedParams.id])

  async function fetchEcriture() {
    try {
      const { data, error } = await supabase
        .from('paroles_ecriture')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error
      
      setFormData({
        reference: data.reference || '',
        texte_complet: data.texte_complet || '',
        traduction: data.traduction || 'TOB',
        contexte: data.contexte || 'messe',
        ce_qui_ma_touche: data.ce_qui_ma_touche || '',
        pour: data.pour || '',
        fruits: data.fruits || [],
        newFruit: ''
      })
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger cette écriture')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('paroles_ecriture')
        .update({
          reference: formData.reference.trim(),
          texte_complet: formData.texte_complet.trim(),
          traduction: formData.traduction,
          contexte: formData.contexte,
          ce_qui_ma_touche: formData.ce_qui_ma_touche.trim(),
          pour: formData.pour.trim() || null,
          fruits: formData.fruits
        })
        .eq('id', resolvedParams.id)

      if (error) throw error
      router.push(`/ecritures/${resolvedParams.id}`)
    } catch (error: any) {
      console.error('Erreur:', error)
      setError(error.message || 'Erreur lors de la sauvegarde')
      setSaving(false)
    }
  }

  const addFruit = () => {
    if (formData.newFruit.trim()) {
      setFormData({
        ...formData,
        fruits: [...formData.fruits, formData.newFruit.trim()],
        newFruit: ''
      })
    }
  }

  const removeFruit = (index: number) => {
    setFormData({
      ...formData,
      fruits: formData.fruits.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href={`/ecritures/${resolvedParams.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Modifier l'écriture</h1>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Référence biblique
              </label>
              <input
                type="text"
                className="input"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                placeholder="Ex: Jean 3, 16"
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Texte complet
              </label>
              <textarea
                className="textarea"
                value={formData.texte_complet}
                onChange={(e) => setFormData({...formData, texte_complet: e.target.value})}
                placeholder="Recopiez le passage biblique..."
                rows={4}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Traduction
                </label>
                <select
                  className="select"
                  value={formData.traduction}
                  onChange={(e) => setFormData({...formData, traduction: e.target.value})}
                >
                  <option value="TOB">TOB</option>
                  <option value="Bible de Jérusalem">Bible de Jérusalem</option>
                  <option value="Louis Segond">Louis Segond</option>
                  <option value="AELF">AELF</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Contexte
                </label>
                <select
                  className="select"
                  value={formData.contexte}
                  onChange={(e) => setFormData({...formData, contexte: e.target.value})}
                >
                  <option value="messe">Messe</option>
                  <option value="lectio_divina">Lectio Divina</option>
                  <option value="priere_personnelle">Prière personnelle</option>
                  <option value="groupe_priere">Groupe de prière</option>
                  <option value="retraite">Retraite</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Ce qui m'a touché
              </label>
              <textarea
                className="textarea"
                value={formData.ce_qui_ma_touche}
                onChange={(e) => setFormData({...formData, ce_qui_ma_touche: e.target.value})}
                placeholder="Qu'est-ce qui vous a marqué dans ce texte ?"
                rows={3}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Pour qui ? (optionnel)
              </label>
              <input
                type="text"
                className="input"
                value={formData.pour}
                onChange={(e) => setFormData({...formData, pour: e.target.value})}
                placeholder="Cette parole est-elle pour quelqu'un en particulier ?"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Fruits spirituels
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={formData.newFruit}
                  onChange={(e) => setFormData({...formData, newFruit: e.target.value})}
                  placeholder="Ajouter un fruit..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFruit())}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addFruit}
                  className="btn btn-secondary"
                >
                  Ajouter
                </button>
              </div>
              {formData.fruits.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.fruits.map((fruit, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {fruit}
                      <button
                        type="button"
                        onClick={() => removeFruit(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4338ca',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '1.125rem',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
                style={{ flex: 1 }}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <Link 
                href={`/ecritures/${resolvedParams.id}`}
                className="btn btn-secondary"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
EOFFILE

# 3. HARMONISER ÉCRITURES LISTE
echo '\n📚 Harmonisation page liste Écritures...'
cat > "app/(app)/ecritures/page.tsx" << 'EOFFILE'
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { Plus, BookOpen, ArrowLeft, Calendar, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function EcrituresPage() {
  const [ecritures, setEcritures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEcritures()
  }, [])

  async function loadEcritures() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('paroles_ecriture')
        .select('*')
        .eq('user_id', user.id)
        .order('date_reception', { ascending: false })

      if (error) throw error
      setEcritures(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContexteLabel = (contexte: string) => {
    const labels: Record<string, string> = {
      messe: 'Messe',
      lectio_divina: 'Lectio Divina',
      priere_personnelle: 'Prière personnelle',
      groupe_priere: 'Groupe de prière',
      retraite: 'Retraite',
      autre: 'Autre'
    }
    return labels[contexte] || contexte
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #e0e7ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/dashboard" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
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
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                📖 Mes paroles d\'Écriture
              </h1>
              <p style={{ color: '#6b7280' }}>
                Les passages bibliques qui vous ont touché
              </p>
            </div>
            <Link 
              href="/ecritures/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                ':hover': { transform: 'translateY(-1px)' }
              }}
            >
              <Plus size={20} />
              Nouvelle écriture
            </Link>
          </div>
        </div>

        {ecritures.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <BookOpen size={48} style={{ 
              margin: '0 auto 1rem', 
              color: '#10b981',
              opacity: 0.5
            }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Aucune parole d\'Écriture notée
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Les passages bibliques qui vous touchent apparaîtront ici.
            </p>
            <Link 
              href="/ecritures/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Noter ma première écriture
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {ecritures.map((ecriture) => (
              <Link
                key={ecriture.id}
                href={`/ecritures/${ecriture.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  {/* Bande colorée en haut */}
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    padding: '1rem 1.5rem',
                    color: 'white'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold',
                      marginBottom: '0.25rem'
                    }}>
                      <BookOpen style={{ display: 'inline', marginRight: '0.5rem' }} size={18} />
                      {ecriture.reference}
                    </h3>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      {getContexteLabel(ecriture.contexte)}
                    </p>
                  </div>
                  
                  {/* Contenu */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Calendar size={14} />
                      {format(new Date(ecriture.date_reception), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                    
                    <div style={{ 
                      fontStyle: 'italic',
                      color: '#4b5563',
                      marginBottom: '1rem',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      "{ecriture.texte_complet}"
                    </div>
                    
                    {ecriture.ce_qui_ma_touche && (
                      <div style={{ 
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem'
                        }}>
                          <Heart size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {ecriture.ce_qui_ma_touche}
                          </span>
                        </p>
                      </div>
                    )}
                    
                    {ecriture.fruits && ecriture.fruits.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {ecriture.fruits.slice(0, 3).map((fruit, index) => (
                            <span 
                              key={index}
                              style={{
                                background: '#e0e7ff',
                                color: '#4338ca',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem'
                              }}
                            >
                              {fruit}
                            </span>
                          ))}
                          {ecriture.fruits.length > 3 && (
                            <span style={{
                              color: '#6b7280',
                              fontSize: '0.75rem',
                              padding: '0.125rem 0.5rem'
                            }}>
                              +{ecriture.fruits.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Citation en bas */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            "Toute Écriture est inspirée de Dieu et utile pour enseigner, réfuter, redresser, former à la justice."
          </p>
          <p style={{ fontSize: '0.875rem' }}>2 Timothée 3, 16</p>
        </div>
      </div>
    </div>
  )
}
EOFFILE

# 4. HARMONISER RENCONTRES LISTE (style moderne)
echo '\n🤝 Harmonisation page liste Rencontres...'
cat > "app/(app)/rencontres/page.tsx" << 'EOFFILE'
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { Plus, Users, ArrowLeft, MapPin, Calendar, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function RencontresPage() {
  const [rencontres, setRencontres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRencontres()
  }, [])

  async function loadRencontres() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('rencontres_missionnaires')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setRencontres(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContexteLabel = (contexte: string) => {
    const labels: Record<string, string> = {
      rue: 'Dans la rue',
      paroisse: 'À la paroisse',
      travail: 'Au travail',
      mission: 'En mission',
      autre: 'Autre'
    }
    return labels[contexte] || contexte
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fce7f3 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fce7f3 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/dashboard" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
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
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                🤝 Mes rencontres missionnaires
              </h1>
              <p style={{ color: '#6b7280' }}>
                Les personnes croisées sur votre chemin
              </p>
            </div>
            <Link 
              href="/rencontres/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
            >
              <Plus size={20} />
              Nouvelle rencontre
            </Link>
          </div>
        </div>

        {rencontres.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Users size={48} style={{ 
              margin: '0 auto 1rem', 
              color: '#f43f5e',
              opacity: 0.5
            }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Aucune rencontre notée
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Les personnes que vous rencontrez apparaîtront ici.
            </p>
            <Link 
              href="/rencontres/nouvelle" 
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Noter ma première rencontre
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {rencontres.map((rencontre) => (
              <Link
                key={rencontre.id}
                href={`/rencontres/${rencontre.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Bande colorée en haut */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    padding: '1rem 1.5rem',
                    color: 'white'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold',
                      marginBottom: '0.25rem'
                    }}>
                      <Users style={{ display: 'inline', marginRight: '0.5rem' }} size={18} />
                      {rencontre.personne_prenom} {rencontre.personne_nom || ''}
                    </h3>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      {getContexteLabel(rencontre.contexte)}
                    </p>
                  </div>
                  
                  {/* Contenu */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {format(new Date(rencontre.date), 'dd MMM', { locale: fr })}
                      </span>
                      {rencontre.lieu && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} />
                          {rencontre.lieu}
                        </span>
                      )}
                    </div>
                    
                    <p style={{ 
                      color: '#4b5563',
                      marginBottom: '1rem',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {rencontre.description}
                    </p>
                    
                    {(rencontre.fruit_immediat || rencontre.fruit_espere) && (
                      <div style={{ 
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        {rencontre.fruit_immediat && (
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <Heart size={14} />
                            Fruit immédiat
                          </p>
                        )}
                        {rencontre.fruit_espere && (
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <Heart size={14} />
                            Fruit espéré
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Citation en bas */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            "J\'étais un étranger et vous m\'avez accueilli."
          </p>
          <p style={{ fontSize: '0.875rem' }}>Matthieu 25, 35</p>
        </div>
      </div>
    </div>
  )
}
EOFFILE

echo '\n✅ Harmonisation complète terminée!'
echo '\nModules mis à jour:'
echo '- Écritures: pages détail et modifier créées'
echo '- Écritures: page liste harmonisée'
echo '- Rencontres: page liste harmonisée'
echo '\nProchaine étape: tester et corriger le bug Paroles'