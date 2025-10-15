import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Hero = () => {
  const [openSection, setOpenSection] = useState(null)
  const [settings, setSettings] = useState({
    heroTitle: 'OG LEGACY',
    heroSubtitle: 'Votre meilleur café à Paris'
  })
  const [sections, setSections] = useState([
    { icon: '📦', title: 'Nos Services', content: 'Nous proposons une large gamme de produits de qualité, livrés avec soin et discrétion.' },
    { icon: '📍', title: 'Zone de Livraison', content: 'Nous livrons dans toute la région avec des délais rapides.' },
    { icon: '🤝', title: 'Meet up', content: 'Possibilité de rencontre en personne dans des lieux publics sécurisés.' },
    { icon: '💕', title: 'Notre Engagement', content: 'Qualité garantie, service client irréprochable et satisfaction totale.' },
    { icon: '💳', title: 'Modes de Paiement', content: 'Nous acceptons : Espèces, Mobile Money, Virement bancaire.' }
  ])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { getById } = await import('../utils/api')
        
        const generalData = await getById('settings', 'general')
        if (generalData) {
          setSettings({
            heroTitle: generalData.heroTitle || settings.heroTitle,
            heroSubtitle: generalData.heroSubtitle || settings.heroSubtitle
          })
        }
        
        const sectionsData = await getById('settings', 'sections')
        if (sectionsData && sectionsData.sections) {
          setSections(sectionsData.sections)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index)
  }

  return (
    <div className="relative min-h-screen cosmic-bg overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 pb-32">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 inline-block"
        >
          {/* Fond ovale identique aux autres pages */}
          <div className="bg-black/90 backdrop-blur-xl rounded-full px-16 py-10 border-2 border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 text-white">
              {settings.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl font-light text-gray-300">
              {settings.heroSubtitle}
            </p>
          </div>
        </motion.div>

        {/* Menu Sections */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4 mt-12"
        >
          {sections.map((section, index) => (
            <MenuSection
              key={index}
              icon={section.icon}
              title={section.title}
              content={section.content}
              isOpen={openSection === index}
              onClick={() => toggleSection(index)}
            />
          ))}
        </motion.div>

      </div>
    </div>
  )
}

const MenuSection = ({ icon, title, content, isOpen, onClick }) => {
  const isImageUrl = icon && icon.includes('http')
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 10 }}
      className="neon-border rounded-lg bg-slate-900/50 backdrop-blur-sm cursor-pointer group transition-all duration-300 overflow-hidden"
    >
      <div className="p-4" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isImageUrl ? (
              <img 
                src={icon} 
                alt={title}
                className="w-12 h-12 object-cover rounded flex-shrink-0"
                onError={(e) => {
                  console.log('Image failed to load:', icon)
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <span className="text-3xl flex-shrink-0">{icon || '📦'}</span>
            )}
            <span className="text-lg font-medium text-white group-hover:text-gradient transition-all duration-300">
              {title}
            </span>
          </div>
          <motion.svg
            className="w-5 h-5 text-gray-300 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-700/20 pt-3 whitespace-pre-line">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Hero
