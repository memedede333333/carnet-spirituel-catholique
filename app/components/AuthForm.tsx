'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              prenom,
              nom,
            },
          },
        })

        if (error) throw error

        setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">
        {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
      </h2>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {message && (
        <div className="auth-success">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <>
            <div className="form-group">
              <label htmlFor="prenom">
                Prénom *
              </label>
              <input
                id="prenom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                placeholder="Jean"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nom">
                Nom (optionnel)
              </label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Dupont"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="jean.dupont@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Mot de passe *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
          />
          {mode === 'register' && (
            <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Minimum 6 caractères
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <div className="auth-form-footer">
        <p>
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <Link href="/register">
                S'inscrire
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <Link href="/login">
                Se connecter
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
