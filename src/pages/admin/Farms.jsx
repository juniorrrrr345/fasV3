import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAll, save, remove } from '../../utils/api'

const AdminFarms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    try {
      const data = await getAll('farms')
      setFarms(data)
    } catch (error) {
      console.error('Error fetching farms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette farm ?')) return

    try {
      await remove('farms', id)
      fetchFarms()
    } catch (error) {
      console.error('Error deleting farm:', error)
    }
  }

  const handleEdit = (farm) => {
    setEditingFarm(farm)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingFarm(null)
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
            Gestion des Farms
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">{farms.length} farm(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-semibold hover:from-gray-200 hover:to-gray-400 transition-all flex items-center justify-center space-x-2"
        >
          <span>➕</span>
          <span className="whitespace-nowrap">Ajouter une farm</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {farms.map((farm) => (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-gray-700 rounded-xl p-4 bg-black/50 hover:bg-black/70 transition-colors"
          >
            <h3 className="text-lg font-bold text-white mb-3">🌾 {farm.name}</h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(farm)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors text-sm"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(farm.id)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors text-sm"
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
          <FarmModal
            farm={editingFarm}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchFarms()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const FarmModal = ({ farm, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await save('farms', {
        id: farm?.id || Date.now().toString(),
        ...formData
      })
      onSuccess()
    } catch (error) {
      console.error('Error saving farm:', error)
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="border border-gray-700 rounded-2xl p-6 bg-black max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          {farm ? '✏️ Modifier la farm' : '➕ Ajouter une farm'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Nom de la farm</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Farm du Nord"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AdminFarms
