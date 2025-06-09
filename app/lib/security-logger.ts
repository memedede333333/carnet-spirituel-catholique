import { supabase } from './supabase'

export async function logSecurityAction(
  action: 'login' | 'logout' | 'password_change' | 'email_change' | 'profile_update' | 'failed_login',
  details?: any
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Récupérer l'IP et le user agent côté client
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null
    
    await supabase
      .from('security_logs')
      .insert({
        user_id: user.id,
        action,
        user_agent: userAgent,
        details: details || {}
      })
  } catch (error) {
    console.error('Erreur lors du log de sécurité:', error)
  }
}
