import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAll, save, remove } from '../../utils/api'
import { uploadToR2 } from '../../utils/cloudflare'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getAll('categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return

    try {
      await remove('categories', id)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient glow-effect mb-2">
            Gestion des Catégories
          </h1>
          <p className="text-gray-400">{categories.length} catégorie(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-white font-semibold hover:from-gray-200 hover:to-gray-400 transition-all flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neon-border rounded-2xl p-6 bg-slate-900/50 backdrop-blur-sm"
          >
            {category.icon && category.icon.startsWith('http') ? (
              <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-slate-800">
                <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-5xl mb-4 text-center">{category.icon}</div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 px-3 py-2 bg-gray-700/20 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors text-sm"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 px-3 py-2 bg-gray-800/20 border border-gray-600/50 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors text-sm"
              >
                🗑️ Supprimer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CategoryModal
            category={editingCategory}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchCategories()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const CategoryModal = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    icon: category?.icon || '🎁',
    description: category?.description || ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (file) => {
    setUploadingImage(true)
    try {
      const result = await uploadToR2(file)
      setFormData({ ...formData, icon: result.url })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryData = {
        id: category?.id || Date.now().toString(),
        ...formData,
        updatedAt: new Date().toISOString()
      }

      if (!category) {
        categoryData.createdAt = new Date().toISOString()
      }

      await save('categories', categoryData)
      onSuccess()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="neon-border rounded-2xl p-8 bg-slate-900 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gradient mb-6">
          {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Icône / Image</label>
            {formData.icon && formData.icon.startsWith('http') ? (
              <div className="mb-3 relative group">
                <img src={formData.icon} alt="Aperçu" className="w-full h-40 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: '🎁' })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
                maxLength="2"
                className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white text-3xl text-center focus:outline-none focus:border-white transition-colors mb-3"
                placeholder="🎁"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={uploadingImage}
              className="w-full px-4 py-2 bg-slate-800 border border-gray-700/30 rounded-lg text-white text-sm focus:outline-none focus:border-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white file:text-xs file:cursor-pointer"
            />
            {uploadingImage && <p className="text-gray-400 text-sm mt-2">Upload en cours...</p>}
            <p className="text-gray-400 text-xs mt-2">Entrez un emoji ou uploadez une image</p>
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

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || uploadingImage}
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

export default AdminCategories
