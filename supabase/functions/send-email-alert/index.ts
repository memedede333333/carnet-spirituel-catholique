import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, type, details } = await req.json()

    let subject = ''
    let html = ''

    if (type === 'email_change_alert') {
      subject = '⚠️ Alerte de sécurité - Changement d\'email demandé'
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-box { background: #FEE2E2; border: 1px solid #FECACA; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .header { background: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Alerte de sécurité</h1>
            </div>
            <div class="content">
              <div class="alert-box">
                <p><strong>⚠️ Attention :</strong> Une demande de changement d'adresse email a été effectuée sur votre compte Carnet Spirituel.</p>
              </div>
              
              <h2>Détails de la demande :</h2>
              <ul>
                <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                <li><strong>Nouvelle adresse :</strong> ${details.new_email}</li>
                <li><strong>Appareil :</strong> ${details.user_agent || 'Non disponible'}</li>
                <li><strong>IP :</strong> ${details.ip_address || 'Non disponible'}</li>
              </ul>
              
              <p><strong>Si vous êtes à l'origine de cette demande :</strong><br>
              Tout va bien ! Un email de confirmation a été envoyé à votre nouvelle adresse.</p>
              
              <p><strong>Si vous n'êtes PAS à l'origine de cette demande :</strong><br>
              Votre compte pourrait être compromis. Agissez immédiatement :</p>
              
              <ol>
                <li>Changez votre mot de passe immédiatement</li>
                <li>Vérifiez votre historique de connexion</li>
                <li>Contactez-nous si nécessaire</li>
              </ol>
              
              <p style="text-align: center;">
                <a href="${details.app_url}/profile/password" class="button">Changer mon mot de passe</a>
              </p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement par Carnet Spirituel.<br>
              Pour toute question, contactez-nous.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Carnet Spirituel <securite@carnet-spirituel.fr>',
        to: [to],
        subject: subject,
        html: html
      }),
    })

    const data = await res.json()
    
    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 },
    )
  }
})
