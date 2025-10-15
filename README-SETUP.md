# Configuration du Projet AVEC Amour

## Problème : Panel Admin ne fonctionne pas

Le panel admin renvoie des erreurs JSON car le worker Cloudflare n'est pas accessible. Voici comment résoudre ce problème :

## Solutions

### Option 1 : Développement Local (Recommandé pour tester)

1. **Démarrer le worker Cloudflare en mode local** :
   ```bash
   npm run dev:worker
   ```
   Cela démarre le worker sur `http://localhost:8787`

2. **Dans un autre terminal, démarrer le frontend** :
   ```bash
   npm run dev
   ```

3. **Ou démarrer les deux en même temps** :
   ```bash
   npm run dev:all
   ```

4. **Initialiser la base de données** :
   - Ouvrez votre navigateur à `http://localhost:8787/api/init`
   - Cela créera les tables et un utilisateur admin par défaut

5. **Accéder au panel admin** :
   - URL : `http://localhost:5173/admin/login`
   - Username : `admin`
   - Password : `admin123`

### Option 2 : Déploiement Production sur Cloudflare

1. **Se connecter à Cloudflare** :
   ```bash
   npx wrangler login
   ```

2. **Déployer le worker** :
   ```bash
   npm run deploy:worker
   ```

3. **Initialiser la base de données en production** :
   - Ouvrez votre navigateur à `https://thegd33.calitek-junior.workers.dev/api/init`

4. **Mettre à jour l'URL de l'API** :
   - Créer un fichier `.env.production.local` :
     ```
     VITE_API_URL=https://thegd33.calitek-junior.workers.dev
     ```

5. **Rebuild et redéployer le frontend** :
   ```bash
   npm run build
   ```

## Configuration des Variables d'Environnement

### Développement Local (.env.local - déjà créé)
```
VITE_API_URL=http://localhost:8787
```

### Production
```
VITE_API_URL=https://thegd33.calitek-junior.workers.dev
```

## Fichiers Créés

- `.env.local` : Configure l'API URL pour pointer vers localhost
- `.dev.vars` : Variables d'environnement pour le worker en local
- Scripts npm mis à jour dans `package.json`

## Troubleshooting

### Erreur "Unexpected token '<', "<!DOCTYPE"..."
Cela signifie que l'API renvoie du HTML au lieu de JSON. Causes possibles :
- Le worker Cloudflare n'est pas démarré (local) ou pas déployé (production)
- L'URL de l'API est incorrecte
- Le worker ne répond pas

### Le worker local ne démarre pas
- Vérifiez que le port 8787 est disponible
- Installez les dépendances : `npm install`
