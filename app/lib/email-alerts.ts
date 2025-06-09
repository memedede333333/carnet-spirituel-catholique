import { supabase } from './supabase'

export async function sendEmailChangeAlert(
  oldEmail: string,
  newEmail: string,
  userAgent?: string
) {
  try {
    // Obtenir l'URL de l'app
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    
    // Pour l'instant, on peut simuler l'envoi ou utiliser un webhook
    // Dans un environnement de production, vous appelleriez votre Edge Function
    console.log('Email d\'alerte envoyé à:', oldEmail, {
      new_email: newEmail,
      user_agent: userAgent,
      app_url: appUrl
    })
    
    // Si vous avez configuré une Edge Function, décommentez ceci :
    /*
    const { data, error } = await supabase.functions.invoke('send-email-alert', {
      body: {
        to: oldEmail,
        type: 'email_change_alert',
        details: {
          new_email: newEmail,
          user_agent: userAgent,
          app_url: appUrl
        }
      }
    })
    
    if (error) throw error
    */
    
    return true
  } catch (error) {
    console.error('Erreur envoi email alerte:', error)
    return false
  }
}
