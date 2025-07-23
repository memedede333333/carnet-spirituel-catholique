'use client'
import { useState, useEffect } from 'react'
import { differenceInDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RappelsDouxProps {
  entries: any[]
  onNavigateToEntry?: (entry: any) => void
}

export default function RappelsDoux({ entries, onNavigateToEntry }: RappelsDouxProps) {
  const [rappels, setRappels] = useState<Array<{ 
    emoji: string; 
    text: string; 
    color: string; 
    action?: string; 
    data?: any;
    type: 'prayer' | 'grace' | 'parole'
  }>>([])
  const router = useRouter()
  
  useEffect(() => {
    const generateRappels = () => {
      const newRappels = []
      const now = new Date()
      
      // 1. Rappels pour les prières anciennes (plus de 90 jours)
      const oldPrayers = entries.filter(e => 
        e.type === 'priere' && 
        e.personne_prenom &&
        differenceInDays(now, new Date(e.date)) > 90
      )
      
      if (oldPrayers.length > 0 && Math.random() < 0.6) { // 60% de chance
        const prayer = oldPrayers[Math.floor(Math.random() * oldPrayers.length)]
        const daysSince = differenceInDays(now, new Date(prayer.date))
        const monthsSince = Math.floor(daysSince / 30)
        
        // Différentes formulations pour varier
        const formulations = [
          {
            text: `${prayer.personne_prenom}, pour qui tu as prié${prayer.sujet ? ' au sujet de ' + prayer.sujet.toLowerCase() : ''}, traverse peut-être ton esprit aujourd'hui... As-tu pris de ses nouvelles ?`,
            action: 'Prendre des nouvelles'
          },
          {
            text: `Te souviens-tu de ${prayer.personne_prenom} ? Cela fait ${monthsSince > 0 ? monthsSince + ' mois' : daysSince + ' jours'} que tu as prié pour ${prayer.personne_genre === 'F' ? 'elle' : prayer.personne_genre === 'M' ? 'lui' : 'cette personne'}${prayer.sujet ? ' (' + prayer.sujet + ')' : ''}...`,
            action: 'Revoir cette prière'
          },
          {
            text: `Il y a ${daysSince} jours, tu confiais ${prayer.personne_prenom} au Seigneur${prayer.sujet ? ' pour ' + prayer.sujet : ''}. Peut-être est-ce le moment de reprendre contact ?`,
            action: 'Voir les détails'
          }
        ]
        
        const formulation = formulations[Math.floor(Math.random() * formulations.length)]
        
        newRappels.push({
          emoji: "🙏",
          text: formulation.text,
          color: '#6366f1',
          action: formulation.action,
          data: prayer,
          type: 'prayer' as const
        })
      }
      
      // 2. Rappels pour les grâces anciennes
      const oldGraces = entries.filter(e => 
        e.type === 'grace' && 
        e.texte &&
        differenceInDays(now, new Date(e.date)) > 30 &&
        differenceInDays(now, new Date(e.date)) < 180
      )
      
      if (oldGraces.length > 0 && Math.random() < 0.5) { // 50% de chance
        const grace = oldGraces[Math.floor(Math.random() * oldGraces.length)]
        const daysSince = differenceInDays(now, new Date(grace.date))
        const preview = grace.texte.substring(0, 50).trim()
        const dateFormatted = format(new Date(grace.date), 'd MMMM', { locale: fr })
        
        const formulations = [
          `Te souviens-tu de cette grâce du ${dateFormatted} : "${preview}..." ? Elle porte peut-être encore du fruit dans ta vie...`,
          `Il y a ${daysSince} jours, le Seigneur t'a fait cette grâce : "${preview}..." Y repenser pourrait éclairer ton chemin aujourd'hui.`,
          `Cette grâce reçue il y a ${Math.floor(daysSince / 7)} semaines résonne peut-être encore : "${preview}..."`,
        ]
        
        newRappels.push({
          emoji: "✨",
          text: formulations[Math.floor(Math.random() * formulations.length)],
          color: '#FCD34D',
          action: 'Relire cette grâce',
          data: grace,
          type: 'grace' as const
        })
      }
      
      // 3. Rappels pour les paroles non accomplies
      const unaccomplishedParoles = entries.filter(e => 
        e.type === 'parole' && 
        !e.date_accomplissement &&
        differenceInDays(now, new Date(e.date)) > 60
      )
      
      if (unaccomplishedParoles.length > 0 && Math.random() < 0.4) { // 40% de chance
        const parole = unaccomplishedParoles[Math.floor(Math.random() * unaccomplishedParoles.length)]
        const preview = parole.texte ? parole.texte.substring(0, 40).trim() : 'Cette parole'
        const destinataire = parole.destinataire === 'moi' ? 'pour toi' : 
                           parole.destinataire === 'personne' && parole.personne_destinataire ? 
                           `pour ${parole.personne_destinataire}` : ''
        
        const formulations = [
          `"${preview}..." - Cette parole ${destinataire} attend peut-être son accomplissement...`,
          `L'Esprit t'avait soufflé ${destinataire} : "${preview}..." Le temps de son accomplissement est-il venu ?`,
          `Cette parole reçue ${destinataire} résonne encore : "${preview}..." Veille et prie...`
        ]
        
        newRappels.push({
          emoji: "🕊️",
          text: formulations[Math.floor(Math.random() * formulations.length)],
          color: '#0ea5e9',
          action: 'Voir la parole',
          data: parole,
          type: 'parole' as const
        })
      }
      
      setRappels(newRappels)
    }
    
    generateRappels()
  }, [entries])
  
  const handleAction = (rappel: typeof rappels[0]) => {
    if (onNavigateToEntry) {
      onNavigateToEntry(rappel.data)
    } else {
      // Navigation par défaut si pas de handler custom
      const typeRoutes: Record<string, string> = {
        priere: 'prieres',
        grace: 'graces',
        parole: 'paroles'
      }
      const route = typeRoutes[rappel.data.type]
      if (route) {
        router.push(`/${route}/${rappel.data.id}`)
      }
    }
  }
  
  if (rappels.length === 0) return null
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    }}>
      {rappels.map((rappel, index) => (
        <div 
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            cursor: rappel.action ? 'pointer' : 'default',
            transition: 'all 0.2s',
            animation: 'fadeIn 0.5s ease-in'
          }}
          onClick={() => rappel.action && handleAction(rappel)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = rappel.color
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = `0 4px 12px ${rappel.color}20`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            background: rappel.color + '20',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            flexShrink: 0
          }}>
            <span style={{fontSize: "20px", color: rappel.color}}>{rappel.emoji}</span>
          </div>
          <p style={{ 
            color: '#1f2937', 
            fontSize: '0.875rem', 
            margin: 0, 
            flex: 1,
            lineHeight: '1.5'
          }}>
            {rappel.text}
          </p>
          {rappel.action && (
            <ChevronRight size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
} 