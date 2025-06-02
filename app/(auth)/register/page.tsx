import AuthForm from '@/app/components/AuthForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">✝️</span>
            <h1 className="text-2xl font-bold text-primary font-serif">
              Carnet de grâces & de missions
            </h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <AuthForm mode="register" />
      </main>

      <footer className="border-t bg-white py-4">
        <div className="text-center text-text-muted">
          <p>&copy; 2024 Carnet de grâces & de missions</p>
        </div>
      </footer>
    </div>
  )
}
