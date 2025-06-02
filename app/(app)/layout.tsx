'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Heart, HandHeart, BookOpen, MessageCircle, Users, LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserEmail(user.email || '')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Carnet Spirituel</h2>
          <p className="user-email">{userEmail}</p>
        </div>
        
        <ul className="nav-menu">
          <li>
            <Link href="/dashboard" className="nav-link">
              <Home size={20} />
              <span>Tableau de bord</span>
            </Link>
          </li>
          <li>
            <Link href="/graces" className="nav-link">
              <Heart size={20} />
              <span>Grâces reçues</span>
            </Link>
          </li>
          <li>
            <Link href="/prieres" className="nav-link">
              <HandHeart size={20} />
              <span>Prières</span>
            </Link>
          </li>
          <li>
            <Link href="/ecritures" className="nav-link">
              <BookOpen size={20} />
              <span>Écritures</span>
            </Link>
          </li>
          <li>
            <Link href="/paroles" className="nav-link">
              <MessageCircle size={20} />
              <span>Paroles</span>
            </Link>
          </li>
          <li>
            <Link href="/rencontres" className="nav-link">
              <Users size={20} />
              <span>Rencontres</span>
            </Link>
          </li>
        </ul>
        
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
