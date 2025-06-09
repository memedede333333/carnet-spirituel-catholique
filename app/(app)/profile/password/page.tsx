'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Key } from 'lucide-react'
import { logSecurityAction } from '@/app/lib/security-logger'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères'
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return 'Le mot de passe doit contenir des majuscules et minuscules'
    }
    if (!/[0-9]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas')
      }

      const passwordError = validatePassword(newPassword)
      if (passwordError) {
        throw new Error(passwordError)
      }

      if (newPassword === currentPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Mot de passe actuel incorrect')
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      await logSecurityAction('password_change')

      setMessage('Mot de passe modifié avec succès ! Vous allez être déconnecté...')
      
      setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login')
      }, 3000)

    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
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
            background: 'linear-gradient(135deg, #E6EDFF, #D6E5F5)'
          }}>
            <Shield size={32} style={{ color: '#6366f1' }} />
          </div>
          <h1 className="form-title">Changer mon mot de passe</h1>
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
          <div className="form-section-spiritual">
            <label htmlFor="currentPassword" className="form-label">
              Mot de passe actuel *
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-spiritual"
              autoComplete="current-password"
            />
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="newPassword" className="form-label">
              Nouveau mot de passe *
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-spiritual"
              autoComplete="new-password"
            />
            <ul style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              paddingLeft: '1rem',
              listStyle: 'disc'
            }}>
              <li>Au moins 8 caractères</li>
              <li>Une majuscule et une minuscule</li>
              <li>Un chiffre</li>
            </ul>
          </div>

          <div className="form-section-spiritual">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-spiritual"
              autoComplete="new-password"
            />
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#FEF3C7',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#92400E',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <div>
              <strong>Sécurité :</strong> Après la modification, vous serez déconnecté de tous vos appareils et devrez vous reconnecter avec votre nouveau mot de passe.
            </div>
          </div>
        </div>

        <div className="form-actions-spiritual">
          <Link href="/profile" className="btn-secondary-spiritual">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-spiritual"
            style={{
              background: loading ? '#9CA3AF' : '#6366f1'
            }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Modification en cours...
              </>
            ) : (
              <>
                <Key size={20} />
                Modifier mon mot de passe
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
