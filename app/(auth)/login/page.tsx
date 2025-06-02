import AuthForm from '@/app/components/AuthForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="container">
          <Link href="/" className="logo">
            <span className="logo-icon">✝️</span>
            <span className="logo-text">Carnet de grâces & de missions</span>
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <AuthForm mode="login" />
      </main>

      <footer className="auth-footer">
        <div className="container">
          <p>&copy; 2024 Carnet de grâces & de missions</p>
        </div>
      </footer>
    </div>
  )
}
