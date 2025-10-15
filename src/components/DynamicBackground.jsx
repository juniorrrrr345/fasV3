import { useEffect, useState } from 'react'

const DynamicBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const { getById } = await import('../utils/api')
        const data = await getById('settings', 'general')
        
        if (data && data.backgroundImage) {
          setBackgroundImage(data.backgroundImage)
        }
      } catch (error) {
        console.error('Error loading background:', error)
      }
    }
    
    setTimeout(loadBackground, 1000)
  }, [])

  useEffect(() => {
    if (backgroundImage) {
      // Vérifier que l'URL est valide
      const img = new Image()
      img.onload = () => {
        document.body.style.backgroundImage = `url(${backgroundImage})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundAttachment = 'scroll'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.willChange = 'auto'
        document.body.style.position = 'relative'
        
        // Ajouter une classe pour identifier qu'une image de fond est active
        document.body.classList.add('has-background-image')
      }
      img.onerror = () => {
        console.error('Erreur lors du chargement de l\'image de fond:', backgroundImage)
        document.body.style.backgroundImage = 'none'
        document.body.classList.remove('has-background-image')
      }
      img.src = backgroundImage
    } else {
      document.body.style.backgroundImage = 'none'
      document.body.style.position = 'static'
      document.body.classList.remove('has-background-image')
    }
  }, [backgroundImage])

  return null
}

export default DynamicBackground
