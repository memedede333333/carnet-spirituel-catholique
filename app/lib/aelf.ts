// Service pour l'API AELF
export async function rechercherPassageBiblique(reference: string): Promise<string | null> {
  try {
    // Pour l'instant, on retourne null car l'API AELF nécessite une configuration spécifique
    // Tu pourras implémenter la vraie recherche plus tard
    console.log('Recherche AELF pour:', reference)
    return null
  } catch (error) {
    console.error('Erreur AELF:', error)
    return null
  }
}

// Fonction pour parser une référence biblique
export function parseReference(reference: string) {
  // Exemples: "Jn 3, 16" ou "Mt 5, 1-12" ou "Ps 23"
  const match = reference.match(/^(\d?\s?\w+)\s+(\d+)(?:\s*,\s*(\d+)(?:-(\d+))?)?$/i)
  
  if (match) {
    return {
      livre: match[1].trim(),
      chapitre: parseInt(match[2]),
      versetDebut: match[3] ? parseInt(match[3]) : null,
      versetFin: match[4] ? parseInt(match[4]) : null
    }
  }
  
  return null
}
