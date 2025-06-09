// Fonction adaptée pour la structure de table existante
const saveSpiritualLink = async (fromEntry: Entry, toEntry: Entry, linkType: string, label: string, notes?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('liens_spirituels')
      .insert({
        user_id: user.id,
        element_source_type: fromEntry.type,
        element_source_id: fromEntry.id,
        element_cible_type: toEntry.type,
        element_cible_id: toEntry.id,
        type_lien: linkType,
        description: `${label}${notes ? ' - ' + notes : ''}`
      })

    if (error) {
      console.error('Erreur lors de la sauvegarde du lien:', error)
      alert('Erreur lors de la sauvegarde du lien')
    } else {
      alert('Lien spirituel créé avec succès !')
      setShowLinkModal(false)
      loadAllEntries()
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}