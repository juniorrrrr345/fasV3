import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const API_URL = 'https://thegd33.calitek-junior.workers.dev'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({ username: '', password: '' })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin-users`)
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      alert('Veuillez remplir tous les champs')
      return
    }

    if (formData.password.length < 4) {
      alert('Le mot de passe doit contenir au moins 4 caractères')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Utilisateur créé avec succès !')
        setShowAddModal(false)
        setFormData({ username: '', password: '' })
        loadUsers()
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('Erreur création:', error)
      alert('❌ Erreur lors de la création')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    
    if (!formData.username) {
      alert('Le nom d\'utilisateur est requis')
      return
    }

    if (formData.password && formData.password.length < 4) {
      alert('Le mot de passe doit contenir au moins 4 caractères')
      return
    }

    try {
      const updateData = { username: formData.username }
      // Ne mettre à jour le mot de passe que s'il est fourni
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`${API_URL}/api/admin-users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Utilisateur modifié avec succès !')
        setShowEditModal(false)
        setCurrentUser(null)
        setFormData({ username: '', password: '' })
        loadUsers()
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('Erreur modification:', error)
      alert('❌ Erreur lors de la modification')
    }
  }

  const handleDelete = async (user) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin-users/${user.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Utilisateur supprimé avec succès !')
        loadUsers()
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('❌ Erreur lors de la suppression')
    }
  }

  const openEditModal = (user) => {
    setCurrentUser(user)
    setFormData({ username: user.username, password: '' })
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">👥 Utilisateurs Admin</h1>
            <p className="text-gray-400">Gérez les comptes administrateurs</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold hover:from-gray-200 hover:to-gray-400 transition-all"
          >
            ➕ Ajouter un utilisateur
          </button>
        </div>

        {/* Liste des utilisateurs */}
        <div className="space-y-4">
          <p className="text-gray-400">{users.length} utilisateur(s) au total</p>
          
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-border rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-1">👤 {user.username}</h3>
                <p className="text-gray-400 text-sm">
                  Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => openEditModal(user)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Ajouter */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6">➕ Ajouter un utilisateur</h2>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                    placeholder="ex: john"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                    placeholder="Minimum 4 caractères"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold hover:from-gray-200 hover:to-gray-400 transition-all"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setFormData({ username: '', password: '' })
                    }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal Modifier */}
        {showEditModal && currentUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6">✏️ Modifier l'utilisateur</h2>
              
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                    placeholder="Laisser vide pour ne pas modifier"
                  />
                  <p className="text-gray-500 text-sm mt-1">Laissez vide pour conserver l'ancien mot de passe</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold hover:from-gray-200 hover:to-gray-400 transition-all"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setCurrentUser(null)
                      setFormData({ username: '', password: '' })
                    }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
  )
}

export default AdminUsers
