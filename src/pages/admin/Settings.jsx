import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getById, save } from '../../utils/api'
import { uploadToR2 } from '../../utils/cloudflare'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    shopName: 'AVEC Amour',
    heroTitle: 'OG LEGACY',
    heroSubtitle: 'Votre texte d\'accueil',
    backgroundImage: ''
  })
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingBg, setUploadingBg] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await getById('settings', 'general')
      if (data && typeof data === 'object') {
        setSettings(data)
      }
      
      const sectionsData = await getById('settings', 'sections')
      if (sectionsData && sectionsData.sections && Array.isArray(sectionsData.sections)) {
        setSections(sectionsData.sections)
      } else {
        // Sections par défaut
        setSections([
          { icon: '📦', title: 'Nos Services', content: 'Nous proposons une large gamme de produits de qualité, livrés avec soin et discrétion. Notre équipe est à votre écoute pour répondre à tous vos besoins.' },
          { icon: '📍', title: 'Zone de Livraison', content: 'Nous livrons dans toute la région avec des délais rapides. Livraison discrète et sécurisée. Contactez-nous pour vérifier si votre zone est couverte.' },
          { icon: '🤝', title: 'Meet up', content: 'Possibilité de rencontre en personne dans des lieux publics sécurisés. Prenez rendez-vous via WhatsApp ou Telegram pour organiser votre meet-up.' },
          { icon: '💕', title: 'Notre Engagement', content: 'Qualité garantie, service client irréprochable et satisfaction totale. Votre confiance est notre priorité absolue.' },
          { icon: '💳', title: 'Modes de Paiement', content: 'Nous acceptons : Espèces, Mobile Money, Virement bancaire. Paiement sécurisé et confidentiel garanti.' }
        ])
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Ignorer l'erreur et garder les valeurs par défaut
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await save('settings', {
        key: 'general',
        ...settings,
        updatedAt: new Date().toISOString()
      })
      
      await save('settings', {
        key: 'sections',
        sections: sections,
        updatedAt: new Date().toISOString()
      })
      
      alert('Paramètres sauvegardés avec succès !')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const addSection = () => {
    setSections([...sections, { icon: '📦', title: '', content: '' }])
  }

  const removeSection = (index) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index))
    }
  }

  const updateSection = (index, field, value) => {
    const newSections = [...sections]
    newSections[index][field] = value
    setSections(newSections)
  }

  const handleBackgroundUpload = async (file) => {
    if (!file) return
    
    setUploadingBg(true)
    try {
      console.log('Upload de l\'image de fond en cours...', file.name)
      const result = await uploadToR2(file)
      console.log('Upload réussi:', result.url)
      setSettings({ ...settings, backgroundImage: result.url })
      alert('Image de fond uploadée avec succès !')
    } catch (error) {
      console.error('Error uploading background:', error)
      alert('Erreur lors de l\'upload de l\'image de fond. Vérifiez la console pour plus de détails.')
    } finally {
      setUploadingBg(false)
    }
  }

  const handleSectionImageUpload = async (file, index) => {
    if (!file) return
    
    try {
      const result = await uploadToR2(file)
      updateSection(index, 'icon', result.url)
    } catch (error) {
      console.error('Error uploading section image:', error)
      alert('Erreur lors de l\'upload de l\'image')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          ⚙️ Configuration
        </h1>
        <p className="text-gray-400">Paramètres généraux de la boutique</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de la boutique */}
          <div className="border border-gray-700 rounded-xl p-6 bg-black/50">
            <h3 className="text-xl font-bold text-white mb-4">🏪 Nom de la boutique</h3>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="AVEC Amour"
            />
          </div>

          {/* Image de fond */}
          <div className="border border-gray-700 rounded-xl p-6 bg-black/50">
            <h3 className="text-xl font-bold text-white mb-4">🖼️ Image de fond du site</h3>
            
            {settings.backgroundImage && (
              <div className="mb-4 relative group">
                <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                  <img 
                    src={settings.backgroundImage} 
                    alt="Fond actuel" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', settings.backgroundImage)
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, backgroundImage: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="text-gray-400 text-xs mt-2">Image de fond actuelle</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleBackgroundUpload(e.target.files[0])}
              disabled={uploadingBg}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white file:text-sm file:cursor-pointer"
            />
            {uploadingBg && <p className="text-gray-400 text-sm mt-2">Upload en cours...</p>}
            <p className="text-gray-400 text-xs mt-2">Cette image sera utilisée comme fond pour toutes les pages (boutique et admin)</p>
          </div>

          {/* Textes page d'accueil */}
          <div className="border border-gray-700 rounded-xl p-6 bg-black/50">
            <h3 className="text-xl font-bold text-white mb-4">🏠 Textes de la page d'accueil</h3>
            <p className="text-gray-400 text-sm mb-4">Le texte s'affichera avec un fond pour être bien visible</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Titre principal (grand texte)</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors"
                  placeholder="OG LEGACY"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm">Sous-titre / Phrase d'accroche</label>
                <textarea
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors resize-none"
                  placeholder="Votre meilleur café à Paris"
                />
              </div>
            </div>
          </div>

          {/* Sections page d'accueil */}
          <div className="border border-gray-700 rounded-xl p-6 bg-black/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📋 Sections de la page d'accueil</h3>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-200"
              >
                + Ajouter une section
              </button>
            </div>
            
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 bg-black/30">
                  <div className="flex items-start space-x-3">
                    {/* Image ou Emoji */}
                    <div className="flex-shrink-0">
                      {section.icon && section.icon.startsWith('http') ? (
                        <div className="relative group">
                          <img 
                            src={section.icon} 
                            alt="Section icon" 
                            className="w-16 h-16 object-cover rounded border border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => updateSection(index, 'icon', '')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={section.icon}
                          onChange={(e) => updateSection(index, 'icon', e.target.value)}
                          className="w-16 h-16 px-3 py-2 bg-black border border-gray-700 rounded text-white text-center text-2xl focus:outline-none focus:border-gray-500"
                          placeholder="📦"
                          maxLength="2"
                        />
                      )}
                      {/* Bouton upload image */}
                      <label className="block mt-2 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionImageUpload(e.target.files[0], index)}
                          className="hidden"
                        />
                        <div className="text-xs text-gray-400 hover:text-white text-center border border-gray-700 rounded px-2 py-1 hover:bg-gray-700 transition-colors">
                          📷 Image
                        </div>
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                        placeholder="Titre de la section"
                      />
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500 resize-none text-sm"
                        placeholder="Contenu de la section"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="px-3 py-2 bg-red-900/20 text-gray-400 rounded hover:bg-red-900/30"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <button
            type="submit"
            disabled={saving || uploadingBg}
            className="w-full py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings
