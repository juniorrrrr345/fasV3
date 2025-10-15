# 🔍 Diagnostic et Solution - Panel Admin

## 🐛 Pourquoi le panel admin ne marche pas ?

### Le problème
Votre panel admin essaie de charger des données depuis l'API Cloudflare Worker à l'adresse :
```
https://thegd33.calitek-junior.workers.dev
```

Mais cette URL renvoie **du HTML** au lieu de **JSON**, d'où les erreurs :
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### La cause
Le worker Cloudflare n'est **pas déployé** ou **pas accessible**. Quand l'API n'existe pas ou ne répond pas, Cloudflare renvoie une page HTML d'erreur par défaut, ce qui provoque l'erreur JSON dans le navigateur.

## ✅ Solutions

### Option 1 : Développement Local (Recommandé pour tester)

#### Étape 1 : Démarrer le worker en local
```bash
npm run dev:worker
```
Le worker sera disponible sur `http://localhost:8787`

#### Étape 2 : Initialiser la base de données
Ouvrir dans le navigateur : `http://localhost:8787/api/init`

#### Étape 3 : Démarrer le frontend
Dans un autre terminal :
```bash
npm run dev
```

#### Étape 4 : Se connecter au panel admin
- URL : `http://localhost:5173/admin/login`
- Username : `admin`
- Password : `admin123`

### Option 2 : Déploiement en Production

#### Étape 1 : Se connecter à Cloudflare
```bash
npx wrangler login
```

#### Étape 2 : Déployer le worker
```bash
npm run deploy:worker
```

#### Étape 3 : Initialiser la base de données en production
Ouvrir dans le navigateur : `https://thegd33.calitek-junior.workers.dev/api/init`

#### Étape 4 : Le panel admin fonctionnera automatiquement
L'application est déjà configurée pour utiliser l'URL de production en production.

## 📦 Fichiers créés/modifiés

### `.env.local` (nouveau)
```env
VITE_API_URL=http://localhost:8787
```
Configure l'application pour utiliser le worker local en développement.

### `.dev.vars` (nouveau)
```env
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```
Variables d'environnement pour le worker en local.

### `wrangler.toml` (corrigé)
Le fichier contenait une erreur (guillemets manquants sur `bucket_name`). Corrigé.

### `package.json` (nouveaux scripts)
```json
{
  "scripts": {
    "dev:worker": "wrangler dev --local --persist",
    "dev:all": "concurrently \"npm run dev:worker\" \"npm run dev\"",
    "deploy:worker": "wrangler deploy"
  }
}
```

## 🎯 Démarrage Rapide

Pour démarrer immédiatement en mode développement :

```bash
# Terminal 1
npm run dev:worker

# Terminal 2 (après avoir initialisé la DB avec http://localhost:8787/api/init)
npm run dev

# Puis ouvrir http://localhost:5173/admin/login
```

Ou en une seule commande :
```bash
npm run dev:all
```

## 📚 Documentation Complète

Voir les fichiers :
- `DEMARRAGE-RAPIDE.md` - Guide de démarrage
- `README-SETUP.md` - Configuration détaillée
