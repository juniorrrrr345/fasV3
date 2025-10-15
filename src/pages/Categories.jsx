import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [productCounts, setProductCounts] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAll } = await import('../utils/api')
        
        // Charger les catégories
        const cats = await getAll('categories')
        setCategories(cats)
        
        // Charger les produits et compter par catégorie
        const products = await getAll('products')
        const counts = {}
        products.forEach(product => {
          const cat = product.category
          counts[cat] = (counts[cat] || 0) + 1
        })
        setProductCounts(counts)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const gradients = [
    'from-white to-gray-200',
    'from-gray-200 to-white',
    'from-gray-300 to-gray-400',
    'from-gray-400 to-gray-500',
    'from-gray-500 to-gray-600',
    'from-white to-gray-300'
  ]

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-theme text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 flex justify-center"
          >
            <div className="inline-block bg-black/90 backdrop-blur-xl rounded-full px-16 py-10 border-2 border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <h1 className="text-5xl md:text-7xl font-bold mb-3 text-white">
                Nos Catégories
              </h1>
              <p className="text-lg text-gray-300">
                Explorez nos différentes catégories de produits choisis avec amour
              </p>
            </div>
          </motion.div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-theme-secondary text-xl">Aucune catégorie disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                  count={productCounts[category.name] || 0}
                  gradient={gradients[index % gradients.length]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

const CategoryCard = ({ category, index, count, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="neon-border rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm group cursor-pointer"
    >
      <Link to="/products" className="block">
        {/* Icon/Image Section */}
        <div className={`relative h-48 flex items-center justify-center ${category.icon && category.icon.startsWith('http') ? 'bg-slate-800' : `bg-gradient-to-br ${gradient}`} overflow-hidden`}>
          {category.icon && category.icon.startsWith('http') ? (
            <img 
              src={category.icon} 
              alt={category.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="text-8xl filter drop-shadow-2xl"
            >
              {category.icon}
            </motion.div>
          )}
          
          {/* Count Badge */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-theme-heading font-bold">{count} produit{count !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-theme-heading mb-2 group-hover:text-gradient transition-all">
            {category.name}
          </h3>
          <p className="text-theme-secondary group-hover:text-theme transition-colors">
            {category.description}
          </p>
          
          <div className="mt-4 flex items-center text-theme-heading font-semibold group-hover:translate-x-2 transition-transform">
            <span>Voir les produits</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default Categories
