import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      navigate('/admin/login')
      return
    }

    // Vérification simplifiée du token
    setIsAuthenticated(true)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-bg">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-slate-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg text-white"
      >
        <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-gray-700/20 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gradient glow-effect mb-8">
            Panel Admin
          </h1>

          <nav className="space-y-2">
            <NavItem to="/admin" icon="📊" active={location.pathname === '/admin'}>
              Dashboard
            </NavItem>
            <NavItem to="/admin/products" icon="📦" active={location.pathname === '/admin/products'}>
              Produits
            </NavItem>
            <NavItem to="/admin/categories" icon="🏷️" active={location.pathname === '/admin/categories'}>
              Catégories
            </NavItem>
            <NavItem to="/admin/farms" icon="🌾" active={location.pathname === '/admin/farms'}>
              Farms
            </NavItem>
            <NavItem to="/admin/socials" icon="🌐" active={location.pathname === '/admin/socials'}>
              Réseaux Sociaux
            </NavItem>
            <NavItem to="/admin/typography" icon="✍️" active={location.pathname === '/admin/typography'}>
              Typographie
            </NavItem>
            <NavItem to="/admin/order-settings" icon="🛒" active={location.pathname === '/admin/order-settings'}>
              Commande
            </NavItem>
            <NavItem to="/admin/users" icon="👥" active={location.pathname === '/admin/users'}>
              Utilisateurs
            </NavItem>
            <NavItem to="/admin/maintenance" icon="🔧" active={location.pathname === '/admin/maintenance'}>
              Maintenance
            </NavItem>
            <NavItem to="/admin/settings" icon="⚙️" active={location.pathname === '/admin/settings'}>
              Configuration
            </NavItem>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-gray-800/20 border border-gray-600/50 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
          
          <Link
            to="/"
            className="mt-2 w-full py-2 px-4 bg-gray-700/20 border border-gray-700/50 rounded-lg text-purple-400 hover:bg-gray-700/30 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🌐</span>
            <span>Voir le site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

const NavItem = ({ to, icon, children, active }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ x: 5 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-white/50 text-white'
          : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{children}</span>
    </motion.div>
  </Link>
)

export default AdminLayout
