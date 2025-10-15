# 🚀 Démarrage Rapide - Panel Admin

## ❌ Problème Actuel

Le panel admin affiche des erreurs JSON car le worker Cloudflare n'est pas démarré/déployé :
- `Erreur vérification maintenance: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
- `Error loading background: SyntaxError...`
- `Error loading shop name: SyntaxError...`

## ✅ Solution Immédiate (Développement Local)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le worker Cloudflare en mode local
Dans un terminal :
```bash
npm run dev:worker
```

Le worker démarrera sur `http://localhost:8787`

### 3. Initialiser la base de données
Ouvrez votre navigateur à :
```
http://localhost:8787/api/init
```

Vous devriez voir :
```json
{"success":true,"message":"Database initialized"}
```

### 4. Démarrer le frontend
Dans un **autre terminal** :
```bash
npm run dev
```

Le frontend démarrera sur `http://localhost:5173`

### 5. Accéder au panel admin
```
URL : http://localhost:5173/admin/login
Username : admin
Password : admin123
```

## 🎯 Alternative : Tout démarrer en une commande
```bash
npm run dev:all
```

Cela démarre le worker ET le frontend en même temps.

## 📝 Ce qui a été corrigé

✅ Fichier `.env.local` créé pour pointer vers localhost  
✅ Fichier `.dev.vars` créé avec les credentials admin par défaut  
✅ Erreur dans `wrangler.toml` corrigée (guillemets manquants)  
✅ Scripts npm ajoutés pour faciliter le développement  

## 🔧 Pour déployer en production

1. Se connecter à Cloudflare :
```bash
npx wrangler login
```

2. Déployer le worker :
```bash
npm run deploy:worker
```

3. Initialiser la base de données en production :
```
https://thegd33.calitek-junior.workers.dev/api/init
```

4. Le panel admin fonctionnera automatiquement avec l'URL de production
