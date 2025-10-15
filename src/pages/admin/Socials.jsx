import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAll, save, remove } from '../../utils/api'

const SocialModal = ({ social, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: social?.name || '',
    icon: social?.icon || '🌐',
    description: social?.description || '',
    url: social?.url || ''
  })
  const [loading, setLoading] = useState(false)

  // Mettre à jour le formData quand social change
  useEffect(() => {
    setFormData({
      name: social?.name || '',
      icon: social?.icon || '🌐',
      description: social?.description || '',
      url: social?.url || ''
    })
  }, [social])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const socialData = {
        id: social?.id || Date.now().toString(),
        ...formData,
        updatedAt: new Date().toISOString()
      }

      if (!social) {
        socialData.createdAt = new Date().toISOString()
      }

      await save('socials', socialData)
      onSuccess()
    } catch (error) {
      console.error('Error saving social:', error)
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="neon-border rounded-2xl p-6 sm:p-8 bg-slate-900 max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-4 sm:mb-6">
          {social ? 'Modifier le réseau social' : 'Ajouter un réseau social'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
              placeholder="WhatsApp, Instagram, etc."
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Icône (emoji)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
              maxLength="2"
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white text-3xl text-center focus:outline-none focus:border-white transition-colors"
              placeholder="💬"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
              placeholder="Contactez-nous directement"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">URL / Lien</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
              placeholder="https://wa.me/..."
              autoComplete="off"
            />
          </div>

          <div className="flex space-x-4">
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

const AdminSocials = () => {
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSocial, setEditingSocial] = useState(null)

  useEffect(() => {
    fetchSocials()
  }, [])

  const fetchSocials = async () => {
    try {
      const data = await getAll('socials')
      setSocials(data)
    } catch (error) {
      console.error('Error fetching socials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) return

    try {
      await remove('socials', id)
      fetchSocials()
    } catch (error) {
      console.error('Error deleting social:', error)
    }
  }

  const handleEdit = (social) => {
    setEditingSocial(social)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingSocial(null)
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
            Gestion des Réseaux Sociaux
          </h1>
          <p className="text-gray-400">{socials.length} réseau(x) social(aux) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-semibold hover:from-gray-200 hover:to-gray-400 transition-all flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Ajouter un réseau social</span>
        </button>
      </div>

      {/* Socials List */}
      <div className="space-y-4">
        {socials.map((social) => (
          <motion.div
            key={social.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="neon-border rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-4xl">{social.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{social.name}</h3>
                <p className="text-gray-400 text-sm">{social.description}</p>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:underline">
                  {social.url}
                </a>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(social)}
                className="px-4 py-2 bg-gray-700/20 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(social.id)}
                className="px-4 py-2 bg-gray-800/20 border border-gray-600/50 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors"
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
          <SocialModal
            social={editingSocial}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchSocials()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminSocials
