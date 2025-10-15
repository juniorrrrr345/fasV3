import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadToR2 } from '../../utils/cloudflare'
import { getAll, save, remove } from '../../utils/api'

// Import React pour useEffect dans ProductModal
const { useEffect: useEffectInModal } = React

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCategoriesAndFarms()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getAll('products')
      // Trier par catégorie puis par farm
      const sorted = data.sort((a, b) => {
        if (a.category !== b.category) {
          return (a.category || '').localeCompare(b.category || '')
        }
        return (a.farm || '').localeCompare(b.farm || '')
      })
      setProducts(sorted)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoriesAndFarms = async () => {
    try {
      const cats = await getAll('categories')
      const farmsList = await getAll('farms')
      setCategories(cats)
      setFarms(farmsList)
    } catch (error) {
      console.error('Error fetching categories/farms:', error)
    }
  }

  // Fonction pour convertir ID -> Nom
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => String(c.id) === String(categoryId))
    return cat ? cat.name : categoryId
  }

  const getFarmName = (farmId) => {
    const farm = farms.find(f => String(f.id) === String(farmId))
    return farm ? farm.name : farmId
  }

  // Fonction pour détecter si c'est un iframe Cloudflare Stream
  const isCloudflareStreamIframe = (url) => {
    if (!url) return false
    return url.includes('cloudflarestream.com') && url.includes('iframe')
  }

  // Fonction pour détecter si c'est une vidéo
  const isVideo = (url) => {
    if (!url) return false
    return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.MOV') || url.endsWith('.webm') || url.endsWith('.avi')
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      await remove('products', id)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient glow-effect mb-2">
            Gestion des Produits
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">{products.length} produit(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-semibold hover:from-gray-200 hover:to-gray-400 transition-all flex items-center justify-center space-x-2"
        >
          <span>➕</span>
          <span className="whitespace-nowrap">Ajouter un produit</span>
        </button>
      </div>

      {/* Products Grid - Mobile | Table - Desktop */}
      <div className="neon-border rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm">
        {/* Mobile Grid View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/30 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                  {(product.photo || product.video || product.image) ? (
                    isCloudflareStreamIframe(product.video || product.photo || product.image) ? (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-900">
                        🎥
                      </div>
                    ) : isVideo(product.video || product.photo || product.image) ? (
                      <video
                        src={product.video || product.photo || product.image}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={product.photo || product.video || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{product.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                  <p className="text-white font-semibold mt-1">{product.price}</p>
                  <p className="text-gray-400 text-xs">{getCategoryName(product.category)}</p>
                  {product.farm && <p className="text-gray-500 text-xs">🌾 {getFarmName(product.farm)}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-3 py-2 bg-gray-700/20 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors text-sm"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 px-3 py-2 bg-gray-800/20 border border-gray-600/50 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors text-sm"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Prix</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Farm</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800">
                      {(product.photo || product.video || product.image) ? (
                        isCloudflareStreamIframe(product.video || product.photo || product.image) ? (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-900 relative z-10">
                            🎥
                          </div>
                        ) : isVideo(product.video || product.photo || product.image) ? (
                          <video
                            src={product.video || product.photo || product.image}
                            className="w-full h-full object-cover relative z-10"
                            muted
                          />
                        ) : (
                          <img
                            src={product.photo || product.video || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover relative z-10"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl relative z-10">
                          📦
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{product.name}</div>
                    <div className="text-gray-400 text-sm line-clamp-1">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">{product.price}</td>
                  <td className="px-6 py-4 text-gray-300">{getCategoryName(product.category)}</td>
                  <td className="px-6 py-4 text-gray-300">{product.farm ? getFarmName(product.farm) : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-2 bg-gray-700/20 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-gray-800/20 border border-gray-600/50 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editingProduct}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchProducts()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    farm: product?.farm || ''
  })
  const [photo, setPhoto] = useState(product?.photo || null)
  const [video, setVideo] = useState(product?.video || null)
  const [variants, setVariants] = useState(
    product?.variants || 
    (product ? [{
      name: 'Standard',
      price: product.price || ''
    }] : [{
      name: '',
      price: ''
    }])
  )
  const [categories, setCategories] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getAll('categories')
      const farmsList = await getAll('farms')
      setCategories(cats)
      setFarms(farmsList)
    }
    fetchData()
  }, [])

  const handlePhotoUpload = async (file) => {
    if (!file) {
      console.log('Aucun fichier sélectionné')
      return
    }
    
    try {
      console.log('=== DÉBUT UPLOAD PHOTO ===')
      console.log('Fichier:', file.name, 'Taille:', file.size, 'Type:', file.type)
      
      const uploadResult = await uploadToR2(file)
      
      console.log('=== RÉSULTAT UPLOAD ===')
      console.log('Résultat complet:', uploadResult)
      console.log('URL générée:', uploadResult.url)
      
      if (!uploadResult || !uploadResult.url) {
        throw new Error('Pas d\'URL dans la réponse du serveur')
      }
      
      setPhoto(uploadResult.url)
      console.log('Photo state mise à jour avec:', uploadResult.url)
      alert('✅ Photo uploadée avec succès ! URL: ' + uploadResult.url)
    } catch (error) {
      console.error('=== ERREUR UPLOAD PHOTO ===')
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      console.error('Erreur complète:', error)
      alert('❌ Erreur lors de l\'upload de la photo: ' + error.message + '\nVérifiez la console (F12) pour plus de détails.')
    }
  }

  const handleVideoUpload = async (file) => {
    if (!file) {
      console.log('Aucun fichier sélectionné')
      return
    }
    
    try {
      console.log('=== DÉBUT UPLOAD VIDÉO ===')
      console.log('Fichier:', file.name, 'Taille:', file.size, 'Type:', file.type)
      
      const uploadResult = await uploadToR2(file)
      
      console.log('=== RÉSULTAT UPLOAD ===')
      console.log('Résultat complet:', uploadResult)
      console.log('URL générée:', uploadResult.url)
      
      if (!uploadResult || !uploadResult.url) {
        throw new Error('Pas d\'URL dans la réponse du serveur')
      }
      
      setVideo(uploadResult.url)
      console.log('Vidéo state mise à jour avec:', uploadResult.url)
      alert('✅ Vidéo uploadée avec succès ! URL: ' + uploadResult.url)
    } catch (error) {
      console.error('=== ERREUR UPLOAD VIDÉO ===')
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      console.error('Erreur complète:', error)
      alert('❌ Erreur lors de l\'upload de la vidéo: ' + error.message + '\nVérifiez la console (F12) pour plus de détails.')
    }
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '' }])
  }

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Valider les variantes
      const validVariants = variants.filter(v => v.name && v.price)
      if (validVariants.length === 0) {
        alert('Veuillez ajouter au moins une variante valide')
        setLoading(false)
        return
      }

      // Construire le tableau de médias (vidéo en premier si disponible)
      const medias = []
      if (video) medias.push(video)
      if (photo) medias.push(photo)

      const productData = {
        id: product?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        farm: formData.farm,
        photo,
        video,
        medias,
        variants: validVariants,
        // Pour la compatibilité avec l'ancien système
        image: video || photo || null,
        price: validVariants[0].price,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await save('products', productData)
      setLoading(false)
      onSuccess()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Erreur lors de la sauvegarde du produit')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="neon-border rounded-2xl p-4 sm:p-6 lg:p-8 bg-slate-900 max-w-2xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient mb-4 sm:mb-6">
          {product ? 'Modifier le produit' : 'Ajouter un produit'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div>
            <label className="block text-gray-300 mb-2">Nom du produit</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon && !cat.icon.startsWith('http') ? cat.icon + ' ' : ''}{cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Farm</label>
            <select
              value={formData.farm}
              onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            >
              <option value="">Aucune farm</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Photo */}
          <div className="border border-gray-700/30 rounded-lg p-4">
            <label className="block text-white font-semibold mb-3">📸 Photo du produit</label>
            
            {/* Aperçu de la photo */}
            {photo && (
              <div className="mb-3 relative group">
                <div className="w-full h-40 rounded overflow-hidden bg-slate-800 border border-gray-700/30">
                  <img 
                    src={photo} 
                    alt="Aperçu photo" 
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', photo)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload photo */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handlePhotoUpload(e.target.files[0])
                e.target.value = '' // Réinitialiser le champ
              }}
              className="w-full px-4 py-2 bg-slate-800 border border-gray-700/30 rounded-lg text-white text-sm focus:outline-none focus:border-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white file:text-xs file:cursor-pointer"
            />
          </div>

          {/* Vidéo */}
          <div className="border border-gray-700/30 rounded-lg p-4">
            <label className="block text-white font-semibold mb-3">🎥 Vidéo du produit</label>
            
            {/* Aperçu de la vidéo */}
            {video && (
              <div className="mb-3 relative group">
                <div className="w-full h-40 rounded overflow-hidden bg-slate-800 border border-gray-700/30">
                  <video 
                    src={video} 
                    className="w-full h-full object-cover relative z-10" 
                    controls
                    muted
                    onError={(e) => {
                      console.error('Erreur de chargement de la vidéo:', video)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setVideo(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload vidéo */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                handleVideoUpload(e.target.files[0])
                e.target.value = '' // Réinitialiser le champ
              }}
              className="w-full px-4 py-2 bg-slate-800 border border-gray-700/30 rounded-lg text-white text-sm focus:outline-none focus:border-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white file:text-xs file:cursor-pointer"
            />
          </div>

          {/* Variantes */}
          <div className="border border-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-white font-semibold">💰 Variantes (Quantité + Prix)</label>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="5g"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-gray-700/30 rounded text-white focus:outline-none focus:border-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="20€"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-gray-700/30 rounded text-white focus:outline-none focus:border-white"
                    required
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="px-3 py-2 bg-gray-800/20 text-gray-400 rounded hover:bg-gray-700/30"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-semibold hover:from-gray-200 hover:to-gray-400 transition-all disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AdminProducts
