# ⚡ Commandes Rapides

## Pour faire fonctionner le panel admin MAINTENANT

### Option A : Deux terminaux séparés

**Terminal 1** - Démarrer le worker (API) :
```bash
npm run dev:worker
```

Puis ouvrir dans le navigateur : `http://localhost:8787/api/init`

**Terminal 2** - Démarrer le frontend :
```bash
npm run dev
```

Puis ouvrir dans le navigateur : `http://localhost:5173/admin/login`

---

### Option B : Tout en une commande

```bash
npm run dev:all
```

Puis ouvrir dans le navigateur : `http://localhost:8787/api/init`  
Puis ouvrir dans le navigateur : `http://localhost:5173/admin/login`

---

## Identifiants par défaut

- **URL** : `http://localhost:5173/admin/login`
- **Username** : `admin`
- **Password** : `admin123`

---

## Scripts disponibles

```bash
npm run dev              # Démarre le frontend uniquement
npm run dev:worker       # Démarre le worker Cloudflare uniquement
npm run dev:all          # Démarre worker + frontend ensemble
npm run build            # Build pour production
npm run deploy:worker    # Déploie le worker sur Cloudflare
```

---

## Déployer en production

```bash
# 1. Se connecter à Cloudflare
npx wrangler login

# 2. Déployer le worker
npm run deploy:worker

# 3. Initialiser la DB en production
# Ouvrir dans le navigateur :
# https://thegd33.calitek-junior.workers.dev/api/init

# 4. Build le frontend
npm run build
```

---

## Troubleshooting

### "Erreur vérification maintenance: SyntaxError..."
➡️ Le worker n'est pas démarré. Lancez `npm run dev:worker`

### "Port 8787 déjà utilisé"
➡️ Un worker tourne déjà. Tuez le process ou redémarrez votre terminal.

### "Database not found"
➡️ Initialisez la DB : ouvrez `http://localhost:8787/api/init` dans le navigateur
