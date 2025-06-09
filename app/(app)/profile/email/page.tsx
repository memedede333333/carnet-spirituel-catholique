'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Shield, AlertCircle } from 'lucide-react'
import type { Profile } from '@/app/types'

export default function ChangeEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'pending'>('form')

  useEffect(() => {
    loadProfile()
    checkPendingEmailChange()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPendingEmailChange = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.new_email) {
        setStep('pending')
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      if (!newEmail.trim() || !confirmEmail.trim() || !password.trim()) {
        throw new Error('Tous les champs sont obligatoires')
      }

      if (newEmail !== confirmEmail) {
        throw new Error('Les adresses email ne correspondent pas')
      }

      if (!validateEmail(newEmail)) {
        throw new Error('Format d\'email invalide')
      }

      if (newEmail === profile?.email) {
        throw new Error('La nouvelle adresse email doit être différente de l\'actuelle')
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile!.email,
        password: password
      })

      if (authError) {
        throw new Error('Mot de passe incorrect')
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (updateError) {
        if (updateError.message.includes('already registered')) {
          throw new Error('Cette adresse email est déjà utilisée')
        }
        throw updateError
      }

      await supabase
        .from('security_logs')
        .insert({
          user_id: profile!.id,
          action: 'email_change',
          user_agent: navigator.userAgent,
          details: { 
            old_email: profile!.email,
            new_email: newEmail,
            status: 'pending'
          }
        })

      setMessage('Un email de confirmation a été envoyé à votre nouvelle adresse. Veuillez cliquer sur le lien pour confirmer le changement.')
      setStep('pending')
      
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>📧</div>
          <p style={{ color: '#6b7280' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (step === 'pending') {
    return (
      <div className="page-container">
        <div className="form-header">
          <Link href="/profile" className="back-link-spiritual">
            <ArrowLeft size={20} />
            <span>Retour au profil</span>
          </Link>
        </div>

        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            📧
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '1rem'
          }}>
            Changement d'email en attente
          </h2>

          <div style={{
            background: '#E0F2FE',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{
              color: '#075985',
              marginBottom: '0.5rem'
            }}>
              Un email de confirmation a été envoyé à votre nouvelle adresse.
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#0C4A6E'
            }}>
              Veuillez cliquer sur le lien dans l'email pour confirmer le changement.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            background: '#FEF3C7',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            textAlign: 'left'
          }}>
            <AlertCircle size={20} style={{ color: '#92400E', flexShrink: 0 }} />
            <div style={{ fontSize: '0.875rem', color: '#92400E' }}>
              <strong>Important :</strong> Le lien de confirmation expire dans 24 heures. 
              Si vous n'avez pas reçu l'email, vérifiez vos spams.
            </div>
          </div>

          <Link href="/profile" className="btn-secondary-spiritual" style={{ marginTop: '2rem' }}>
            Retour au profil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <Link href="/profile" className="back-link-spiritual">
          <ArrowLeft size={20} />
          <span>Retour au profil</span>
        </Link>
        <div className="form-title-section">
          <div className="page-icon-wrapper" style={{
            background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)'
          }}>
            <Mail size={32} style={{ color: '#0EA5E9' }} />
          </div>
          <h1 className="form-title">Changer mon adresse email</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="spiritual-form">
        {error && (
          <div className="alert-error-spiritual">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            background: '#D1FAE5',
            color: '#047857',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #A7F3D0'
          }}>
            <span>✅</span>
            {message}
          </div>
        )}

        <div className="form-card">
          <div style={{
            background: '#F0F9FF',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#075985',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Shield size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Processus sécurisé</strong><br />
              Vous recevrez un email de confirmation à votre nouvelle adresse. 
              Le changement ne sera effectif qu'après validation du lien.
            </div>
          </div>

          <div className="form-section-spiritual">
            <label className="form-label">
              Email actuel
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="input-spiritual"
              style={{
                background: '#F3F4F6',
                color: '#6B7280',
                cursor: 'not-allowed'
              }}
            />
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="newEmail" className="form-label">
              Nouvelle adresse email *
            </label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              placeholder="nouvelle@email.com"
              className="input-spiritual"
              autoComplete="email"
            />
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="confirmEmail" className="form-label">
              Confirmer la nouvelle adresse email *
            </label>
            <input
              type="email"
              id="confirmEmail"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              placeholder="nouvelle@email.com"
              className="input-spiritual"
              autoComplete="off"
            />
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="password" className="form-label">
              Mot de passe actuel *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-spiritual"
              autoComplete="current-password"
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '0.25rem'
            }}>
              Pour des raisons de sécurité, nous devons vérifier votre identité
            </p>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#FEF3C7',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#92400E'
          }}>
            <strong>⚠️ Important :</strong>
            <ul style={{
              marginTop: '0.5rem',
              marginBottom: 0,
              paddingLeft: '1.5rem'
            }}>
              <li>Vous devrez confirmer le changement via email</li>
              <li>Vous serez déconnecté après la confirmation</li>
              <li>Utilisez votre nouvelle adresse pour vous reconnecter</li>
            </ul>
          </div>
        </div>

        <div className="form-actions-spiritual">
          <Link href="/profile" className="btn-secondary-spiritual">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-spiritual"
            style={{
              background: saving ? '#9CA3AF' : '#0EA5E9'
            }}
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail size={20} />
                Changer mon email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
