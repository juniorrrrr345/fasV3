/**
 * Upload vers Cloudflare R2 via Worker API
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://thegd33.calitek-junior.workers.dev'

export const uploadToR2 = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    throw error
  }
}

export const getR2Url = (filename) => {
  if (filename.startsWith('http')) {
    return filename
  }
  return `https://pub-53af7ff6cf154e87af25e68525a4bf74.r2.dev/${filename}`
}

export const deleteFromR2 = async (filename) => {
  // Pour l'instant, on ne supprime pas les fichiers
  console.log('Suppression du fichier:', filename)
  return true
}
