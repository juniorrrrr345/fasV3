import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [farms, setFarms] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [orderLink, setOrderLink] = useState('#')
  const [orderButtonText, setOrderButtonText] = useState('Commander')

  useEffect(() => {
    const fetchProduct = async () => {
      const { getById, getAll } = await import('../utils/api')
      const found = await getById('products', id)
      setProduct(found)
      
      // Charger les catégories et farms
      const categoriesData = await getAll('categories')
      const farmsData = await getAll('farms')
      setCategories(categoriesData)
      setFarms(farmsData)
      
      // Charger les paramètres de commande
      const settings = await getAll('settings')
      if (settings.orderLink) {
        setOrderLink(settings.orderLink)
      }
      if (settings.orderButtonText) {
        setOrderButtonText(settings.orderButtonText)
      }
    }
    fetchProduct()
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  // Construire le tableau de médias - PHOTO EN PREMIER, puis vidéo
  const allMedias = []
  
  // Ajouter tous les médias disponibles - PHOTO D'ABORD
  if (product.photo && product.photo.trim()) allMedias.push(product.photo)
  if (product.image && product.image.trim()) allMedias.push(product.image)
  if (product.video && product.video.trim()) allMedias.push(product.video)
  
  // Vérifier aussi dans medias si c'est un tableau
  if (product.medias && Array.isArray(product.medias)) {
    product.medias.forEach(media => {
      if (media && media.trim() && !allMedias.includes(media)) {
        allMedias.push(media)
      }
    })
  }
  
  const medias = allMedias
  
  // Debug logs
  console.log('ProductDetail - Product data:', product)
  console.log('ProductDetail - Video:', product.video)
  console.log('ProductDetail - Photo:', product.photo)
  console.log('ProductDetail - Image:', product.image)
  console.log('ProductDetail - All medias:', allMedias)
  console.log('ProductDetail - Selected media:', medias[selectedMedia])
  
  // Fonction pour détecter si c'est une vidéo
  const isVideo = (url) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.mov', '.MOV', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.startsWith('data:video')
  }
  
  // Fonction pour détecter si c'est un iframe Cloudflare Stream
  const isCloudflareStreamIframe = (url) => {
    if (!url) return false
    return url.includes('cloudflarestream.com') && url.includes('iframe')
  }
  
  const variants = product.variants || [{
    name: 'Standard',
    price: product.price
  }]

  const currentVariant = variants[selectedVariant]
  const currentMedia = medias[selectedMedia]
  
  // Trouver les noms de catégorie et farm (convertir en string pour la comparaison)
  const categoryName = categories.find(c => String(c.id) === String(product.category))?.name || product.category
  const farmName = farms.find(f => String(f.id) === String(product.farm))?.name || product.farm

  const handleCommand = () => {
    if (!orderLink || orderLink === '#') {
      alert('Lien de commande non configuré. Contactez l\'administrateur.')
      return
    }
    
    const message = `Bonjour, je voudrais commander:\n\n${product.name}\n${currentVariant.name} - ${currentVariant.price}`
    
    // Si c'est un lien WhatsApp, ajouter le message
    if (orderLink.includes('wa.me') || orderLink.includes('whatsapp')) {
      const urlWithMessage = `${orderLink}${orderLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`
      window.open(urlWithMessage, '_blank')
    } else {
      // Sinon, ouvrir le lien tel quel
      window.open(orderLink, '_blank')
    }
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 lg:mb-8 flex items-center space-x-2 text-gray-400 text-xs sm:text-sm overflow-x-auto"
          >
            <Link to="/" className="hover:text-white transition-colors whitespace-nowrap">Accueil</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors whitespace-nowrap">Produits</Link>
            <span>/</span>
            <span className="text-white truncate">{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Galerie Médias */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Média Principal */}
              <div className="neon-border rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMedia}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative z-10"
                  >
                    {currentMedia ? (
                      isCloudflareStreamIframe(currentMedia) ? (
                        <iframe
                          src={currentMedia}
                          className="w-full h-full"
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                          allowFullScreen
                          style={{ border: 'none' }}
                        />
                      ) : isVideo(currentMedia) ? (
                        <video
                          src={currentMedia}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          loop
                          muted
                          onError={(e) => console.error('Erreur vidéo détail:', currentMedia, e)}
                          onLoadStart={() => console.log('Chargement vidéo détail:', currentMedia)}
                        />
                      ) : (
                        <img
                          src={currentMedia}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => console.error('Erreur image détail:', currentMedia, e)}
                          onLoad={() => console.log('Image détail chargée:', currentMedia)}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-9xl">
                        🎁
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Miniatures */}
              {medias.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {medias.map((media, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedMedia(index)}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedMedia === index
                          ? 'border-white shadow-lg shadow-pink-500/50'
                          : 'border-gray-700/30 hover:border-white/50'
                      }`}
                    >
                      {isCloudflareStreamIframe(media) ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl">
                          🎥
                        </div>
                      ) : isVideo(media) ? (
                        <video 
                          src={media} 
                          className="w-full h-full object-cover" 
                          muted 
                          onError={(e) => console.error('Erreur vidéo miniature:', media, e)}
                        />
                      ) : (
                        <img 
                          src={media} 
                          alt={`${product.name} ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => console.error('Erreur image miniature:', media, e)}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Debug info */}
              {medias.length === 0 && (
                <div className="text-center p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">Aucun média trouvé pour ce produit</p>
                  <p className="text-gray-500 text-xs mt-1">Vérifiez la console pour plus de détails</p>
                </div>
              )}
            </motion.div>

            {/* Informations Produit */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Titre et Prix */}
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl px-6 py-6 border-2 border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <h1 className="text-4xl md:text-5xl font-bold text-white glow-effect mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline flex-wrap gap-3 mb-3">
                  <span className="text-5xl font-bold text-white">
                    {currentVariant.price}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryName && (
                    <span className="px-3 py-1 bg-white/20 border border-white/50 rounded-full text-white text-sm">
                      🏷️ {categoryName}
                    </span>
                  )}
                  {farmName && (
                    <span className="px-3 py-1 bg-white/20 border border-white/50 rounded-full text-white text-sm">
                      🌾 {farmName}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="neon-border rounded-xl p-4 sm:p-6 bg-black/90 backdrop-blur-xl border-2 border-white/30">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">📝 Description</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Variantes (Quantité + Prix) */}
              <div className="neon-border rounded-xl p-4 sm:p-6 bg-black/90 backdrop-blur-xl border-2 border-white/30">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">💰 Quantité & Prix</h3>
                <div className="space-y-2 sm:space-y-3">
                  {variants.map((variant, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVariant(index)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        selectedVariant === index
                          ? 'border-white bg-white/10 text-white'
                          : 'border-gray-700/30 bg-slate-800/50 text-gray-300 hover:border-white/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-xl sm:text-2xl">{selectedVariant === index ? '✓' : '○'}</span>
                        <div className="text-left">
                          <div className="text-base sm:text-lg font-bold text-white">{variant.name}</div>
                          <div className="text-xs sm:text-sm text-gray-400">Quantité disponible</div>
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white">{variant.price}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Commande */}
              <div className="neon-border rounded-xl p-4 sm:p-6 bg-black/90 backdrop-blur-xl border-2 border-white/30 space-y-4">
                <button
                  onClick={handleCommand}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold text-base sm:text-lg hover:from-gray-200 hover:to-gray-400 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>{orderButtonText}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetail
