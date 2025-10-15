# 🛍️ AVEC Amour - Boutique E-Commerce

Boutique e-commerce moderne avec panel d'administration complet, propulsée par React, Vite, et Cloudflare Workers.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ installé
- npm installé

### Installation
```bash
npm install
```

### Lancer en Développement

**Option 1 : Tout en une commande**
```bash
npm run dev:all
```

**Option 2 : Terminaux séparés**
```bash
# Terminal 1 - Worker API
npm run dev:worker

# Terminal 2 - Frontend
npm run dev
```

### Initialiser la Base de Données
Ouvrir dans le navigateur : `http://localhost:8787/api/init`

### Accéder au Panel Admin
- **URL** : `http://localhost:5173/admin/login`
- **Username** : `admin`
- **Password** : `admin123`

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| **[LISEZ-MOI-DABORD.md](LISEZ-MOI-DABORD.md)** | ⭐ **Commencez ici** - Solution rapide |
| [GUIDE-VISUEL.md](GUIDE-VISUEL.md) | Guide visuel étape par étape |
| [COMMANDES.md](COMMANDES.md) | Liste de toutes les commandes |
| [DEMARRAGE-RAPIDE.md](DEMARRAGE-RAPIDE.md) | Guide de démarrage complet |
| [RESUME-PROBLEME.md](RESUME-PROBLEME.md) | Résolution des problèmes courants |
| [INDEX-DOCUMENTATION.md](INDEX-DOCUMENTATION.md) | Index de toute la documentation |

---

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Démarre le frontend (port 5173)
npm run dev:worker       # Démarre le worker Cloudflare (port 8787)
npm run dev:all          # Démarre worker + frontend ensemble
npm run build            # Build pour production
npm run deploy:worker    # Déploie le worker sur Cloudflare
npm run preview          # Prévisualise le build de production
```

---

## 🏗️ Architecture

```
Frontend (React + Vite)
       ↓
   API Calls
       ↓
Cloudflare Worker (API)
       ↓
Cloudflare D1 (Database) + R2 (Storage)
```

### Stack Technique
- **Frontend** : React 18, Vite, TailwindCSS, Framer Motion
- **Backend** : Cloudflare Workers
- **Base de données** : Cloudflare D1 (SQLite)
- **Stockage** : Cloudflare R2
- **Déploiement** : Vercel (frontend) + Cloudflare (backend)

---

## 📁 Structure du Projet

```
/workspace
├── src/                    # Code source frontend
│   ├── components/         # Composants React
│   ├── pages/             # Pages de l'application
│   │   └── admin/         # Pages du panel admin
│   └── utils/             # Utilitaires et API client
├── worker/                # Code du worker Cloudflare
│   └── index.js          # API endpoints
├── .env.local            # Configuration locale (créé)
├── .dev.vars             # Variables du worker (créé)
├── wrangler.toml         # Configuration Cloudflare
├── vite.config.js        # Configuration Vite
└── package.json          # Dépendances et scripts
```

---

## 🎯 Fonctionnalités

### Boutique Publique
- ✅ Page d'accueil personnalisable
- ✅ Catalogue de produits avec filtres
- ✅ Détails des produits
- ✅ Catégories
- ✅ Page de contact avec réseaux sociaux
- ✅ Mode maintenance
- ✅ Thème personnalisable
- ✅ Fond d'écran dynamique

### Panel Admin
- ✅ Authentification sécurisée
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des catégories
- ✅ Gestion des fermes/producteurs
- ✅ Gestion des réseaux sociaux
- ✅ Configuration générale
- ✅ Gestion des utilisateurs admin
- ✅ Mode maintenance
- ✅ Upload de fichiers vers R2
- ✅ Personnalisation de la typographie

---

## 🚢 Déploiement en Production

### 1. Déployer le Worker Cloudflare
```bash
# Se connecter à Cloudflare
npx wrangler login

# Déployer
npm run deploy:worker

# Initialiser la base de données
# Ouvrir : https://thegd33.calitek-junior.workers.dev/api/init
```

### 2. Déployer le Frontend
```bash
# Build
npm run build

# Le déploiement Vercel se fait automatiquement via Git
```

---

## 🔧 Configuration

### Variables d'Environnement

**Développement Local** (`.env.local`) :
```env
VITE_API_URL=http://localhost:8787
```

**Production** :
```env
VITE_API_URL=https://thegd33.calitek-junior.workers.dev
```

### Worker Cloudflare (`.dev.vars`) :
```env
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

---

## 🆘 Dépannage

### Erreur : "Unexpected token '<', "<!DOCTYPE"..."
**Cause** : Le worker n'est pas démarré  
**Solution** : `npm run dev:worker`

### Erreur : "Database not found"
**Cause** : Base de données non initialisée  
**Solution** : Ouvrir `http://localhost:8787/api/init`

### Erreur : "Port already in use"
**Cause** : Un processus utilise déjà le port  
**Solution** : Tuer le processus ou changer de port

👉 Consultez [RESUME-PROBLEME.md](RESUME-PROBLEME.md) pour plus de solutions

---

## 📝 Changelog

Voir [CHANGELOG-CORRECTIONS.md](CHANGELOG-CORRECTIONS.md) pour la liste des corrections récentes.

---

## 📄 Licence

Projet privé - Tous droits réservés

---

## 🤝 Support

Pour toute question, consultez la documentation dans le dossier racine du projet.

---

**Made with ❤️ by AVEC Amour Team**
