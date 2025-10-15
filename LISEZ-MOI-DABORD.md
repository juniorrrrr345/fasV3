# ⚠️ LISEZ-MOI D'ABORD

## Problème : Panel Admin ne marche pas

**Pourquoi ?** Le worker Cloudflare (API) n'est pas démarré.

**Solution rapide** (3 étapes) :

1. **Démarrer le worker** :
   ```bash
   npm run dev:worker
   ```

2. **Initialiser la base de données** :  
   Ouvrir dans le navigateur : `http://localhost:8787/api/init`

3. **Démarrer le frontend** (dans un autre terminal) :
   ```bash
   npm run dev
   ```

4. **Se connecter** :  
   URL : `http://localhost:5173/admin/login`  
   Username : `admin`  
   Password : `admin123`

---

## OU en une seule commande :
```bash
npm run dev:all
```

Puis faire les étapes 2 et 4 ci-dessus.

---

## Fichiers corrigés :
✅ `wrangler.toml` - Erreur de syntaxe corrigée  
✅ `.env.local` - Créé pour le développement local  
✅ `.dev.vars` - Créé avec les credentials admin  
✅ `vite.config.js` - Port corrigé (8787 au lieu de 5000)  
✅ `package.json` - Nouveaux scripts ajoutés  

---

## Documentation complète :
- `COMMANDES.md` - Liste de toutes les commandes
- `RESUME-PROBLEME.md` - Explication détaillée du problème
- `SOLUTION.md` - Diagnostic complet
- `DEMARRAGE-RAPIDE.md` - Guide de démarrage
