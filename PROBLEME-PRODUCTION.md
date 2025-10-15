# 🚨 PROBLÈME EN PRODUCTION SUR VERCEL

## ❌ Le Problème

Votre site sur Vercel affiche des erreurs JSON car le **worker Cloudflare est protégé par Cloudflare Access**.

Quand votre application essaie d'appeler l'API, Cloudflare renvoie une **page HTML de connexion** au lieu de JSON.

## 🔍 Preuve

```bash
curl https://thegd33.calitek-junior.workers.dev/api/settings
```

Renvoie une **redirection 302** vers :
```
https://calitek-junior.cloudflareaccess.com/cdn-cgi/access/login/...
```

Au lieu de renvoyer du JSON.

## ✅ SOLUTION

Vous devez **désactiver Cloudflare Access** pour ce worker OU le configurer pour autoriser l'accès public.

### Option 1 : Désactiver Cloudflare Access (Recommandé)

1. **Connectez-vous à Cloudflare Dashboard** :
   - Allez sur https://dash.cloudflare.com

2. **Naviguez vers Zero Trust** :
   - Dans le menu de gauche : `Zero Trust` → `Access` → `Applications`

3. **Trouvez votre worker** :
   - Cherchez : `thegd33.calitek-junior.workers.dev`

4. **Désactivez ou supprimez la protection** :
   - Cliquez sur l'application
   - **Désactivez** la protection
   - OU **supprimez** l'application de la liste Access

5. **Testez** :
   ```bash
   curl https://thegd33.calitek-junior.workers.dev/api/settings
   ```
   Vous devriez maintenant recevoir du JSON au lieu d'une redirection.

### Option 2 : Créer une exception pour /api/*

Si vous voulez garder la protection mais autoriser l'API publique :

1. Dans Cloudflare Access, modifiez l'application
2. Ajoutez une règle pour **exclure** les chemins `/api/*`
3. Ou créez une règle "Bypass" pour les requêtes API

### Option 3 : Utiliser des Service Tokens

Configuration avancée pour autoriser votre frontend Vercel uniquement.

## 🧪 Test Rapide

Après avoir désactivé Cloudflare Access, testez :

```bash
curl https://thegd33.calitek-junior.workers.dev/api/settings
```

Vous devriez voir :
```json
{
  "shopName": "AVEC Amour",
  "heroTitle": "OG LEGACY",
  ...
}
```

Au lieu d'une page HTML de login.

## 🎯 Après la Correction

Une fois Cloudflare Access désactivé :

1. **Votre site Vercel fonctionnera immédiatement**
2. **Le panel admin sera accessible**
3. **Plus d'erreurs JSON**

## ⚠️ Note Importante

Votre worker `vercel.json` pointe aussi vers `server/index.js` qui n'existe pas :

```json
{
  "src": "server/index.js",
  "use": "@vercel/node"
}
```

Ce fichier n'existe pas dans votre projet. Il faut le supprimer du `vercel.json`.

## 🔧 Correction du vercel.json

Le `vercel.json` actuel est incorrect. Voici la bonne configuration :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

Supprimez les références à `server/index.js` qui n'existe pas.

## 📝 Résumé

**Problème principal** : Cloudflare Access bloque l'API  
**Solution** : Désactiver Cloudflare Access pour ce worker  
**Problème secondaire** : vercel.json référence un serveur inexistant  
**Solution** : Nettoyer le vercel.json
