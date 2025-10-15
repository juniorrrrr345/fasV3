import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getById, save } from '../../utils/api'

const Maintenance = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('🔧 Site en maintenance\n\nNous effectuons actuellement des améliorations.\nNous serons bientôt de retour !')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getById('settings', 'general')
      if (settings) {
        setMaintenanceMode(settings.maintenanceMode || false)
        setMaintenanceMessage(settings.maintenanceMessage || '🔧 Site en maintenance\n\nNous effectuons actuellement des améliorations.\nNous serons bientôt de retour !')
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const settings = await getById('settings', 'general')
      
      await save('settings', {
        id: 'general',
        ...settings,
        maintenanceMode,
        maintenanceMessage
      })

      alert('✅ Paramètres de maintenance enregistrés !')
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      alert('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔧 Mode Maintenance</h1>
          <p className="text-gray-400">Activez le mode maintenance pour effectuer des modifications en toute tranquillité</p>
        </div>

        {/* Avertissement */}
        {maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-orange-900/30 border-2 border-orange-500 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-orange-400 font-bold text-lg mb-1">MODE MAINTENANCE ACTIVÉ</h3>
                <p className="text-orange-300 text-sm">
                  Les visiteurs voient actuellement la page de maintenance. Seul le panel admin est accessible.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configuration */}
        <div className="neon-border rounded-2xl p-8 bg-slate-900/50 backdrop-blur-sm space-y-6">
          {/* Toggle Maintenance */}
          <div className="flex items-center justify-between p-6 bg-black/30 rounded-xl border border-gray-700/50">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Activer le mode maintenance</h3>
              <p className="text-gray-400 text-sm">Le site sera inaccessible aux visiteurs (sauf panel admin)</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-20 h-10 rounded-full transition-colors ${
                maintenanceMode ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                animate={{ x: maintenanceMode ? 40 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Message de maintenance */}
          <div>
            <label className="block text-white font-bold mb-3">📝 Message de maintenance</label>
            <p className="text-gray-400 text-sm mb-3">Ce message sera affiché aux visiteurs pendant la maintenance</p>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white resize-none font-mono"
              placeholder="🔧 Site en maintenance..."
            />
            <p className="text-gray-500 text-sm mt-2">💡 Astuce : Utilisez \n pour les sauts de ligne</p>
          </div>

          {/* Aperçu */}
          <div>
            <label className="block text-white font-bold mb-3">👁️ Aperçu</label>
            <div className="p-8 bg-black/50 rounded-xl border-2 border-gray-700/50 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <div className="text-white text-lg whitespace-pre-line leading-relaxed">
                {maintenanceMessage}
              </div>
            </div>
          </div>

          {/* Bouton Sauvegarder */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-white to-gray-200 rounded-lg text-black font-bold text-lg hover:from-gray-200 hover:to-gray-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
            </button>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-6 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
          <h3 className="text-blue-400 font-bold mb-2">ℹ️ Informations importantes</h3>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Le panel admin reste toujours accessible en mode maintenance</li>
            <li>• Les visiteurs verront uniquement la page de maintenance</li>
            <li>• Pensez à désactiver le mode après vos modifications</li>
            <li>• Le message supporte les sauts de ligne avec \n</li>
          </ul>
        </div>
      </div>
  )
}

export default Maintenance
