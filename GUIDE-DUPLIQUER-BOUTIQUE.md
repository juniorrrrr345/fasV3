# 🏪 GUIDE : DUPLIQUER LA BOUTIQUE POUR UN NOUVEAU PROJET

Ce guide vous permet de créer une **nouvelle boutique indépendante** à partir de ce code, avec sa propre base de données et son propre worker Cloudflare.

---

## ⚠️ IMPORTANT : INDÉPENDANCE TOTALE

Chaque nouvelle boutique aura :
- ✅ Sa **propre base de données D1** (produits, catégories, farms séparés)
- ✅ Son **propre Worker Cloudflare** (API séparée)
- ✅ Son **propre bucket R2** (images/vidéos séparées)
- ✅ Son **propre déploiement Vercel** (site séparé)

**Résultat** : Aucune interférence entre les boutiques !

---

## 📋 ÉTAPE 1 : DUPLIQUER LE GITHUB

### 1.1 Créer un Nouveau Dépôt GitHub

**Option A : Fork (Recommandé)**
```bash
# Sur GitHub, cliquez sur "Fork" en haut à droite
# Renommez le fork avec le nom de la nouvelle boutique
# Exemple : BOUTIQUE-SHOP-2
```

**Option B : Clone + Nouveau Repo**
```bash
# Cloner le repo actuel
git clone https://github.com/juniorrrrr345/THEGD33V3.git NOUVELLE-BOUTIQUE
cd NOUVELLE-BOUTIQUE

# Supprimer l'ancien remote
git remote remove origin

# Créer un nouveau repo sur GitHub (via interface web)
# Puis ajouter le nouveau remote
git remote add origin https://github.com/VOTRE-USERNAME/NOUVELLE-BOUTIQUE.git
git push -u origin main
```

---

## 📋 ÉTAPE 2 : CRÉER UNE NOUVELLE BASE D1

### 2.1 Créer la Base de Données

```bash
# Se connecter à Cloudflare
wrangler login

# Créer une NOUVELLE base D1 avec un nom unique
wrangler d1 create boutique-shop-2-db

# ⚠️ NOTEZ L'ID RETOURNÉ (très important !)
# Exemple : database_id = "abc123-xyz-456-def"
```

### 2.2 Initialiser les Tables

```bash
# Exécuter le schéma SQL sur la NOUVELLE base
wrangler d1 execute boutique-shop-2-db --file=./worker/schema.sql --remote
```

**Vérifier** :
```bash
# Lister les tables
wrangler d1 execute boutique-shop-2-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

Vous devriez voir :
- `settings`
- `products`
- `categories`
- `farms`
- `users`

---

## 📋 ÉTAPE 3 : CRÉER UN NOUVEAU BUCKET R2

### 3.1 Créer le Bucket

```bash
# Créer un NOUVEAU bucket R2 avec un nom unique
wrangler r2 bucket create boutique-shop-2-media

# Rendre le bucket public
wrangler r2 bucket publish boutique-shop-2-media
```

### 3.2 Obtenir l'URL Publique

L'URL publique sera :
```
https://pub-XXXXXXXXX.r2.dev/
```

**⚠️ NOTEZ cette URL, vous en aurez besoin !**

---

## 📋 ÉTAPE 4 : CONFIGURER LE WORKER

### 4.1 Modifier `wrangler.toml`

Ouvrez `wrangler.toml` et modifiez :

```toml
# ANCIEN (boutique principale)
name = "thegd33"

# NOUVEAU (nouvelle boutique)
name = "boutique-shop-2"
```

```toml
# ANCIEN (boutique principale)
[[d1_databases]]
binding = "DB"
database_name = "gd33v3"
database_id = "l'ancien ID"

# NOUVEAU (nouvelle boutique)
[[d1_databases]]
binding = "DB"
database_name = "boutique-shop-2-db"
database_id = "VOTRE-NOUVEAU-ID-D1"  # ← ID obtenu à l'étape 2.1
```

```toml
# ANCIEN (boutique principale)
[[r2_buckets]]
binding = "R2"
bucket_name = "boutiqueop"

# NOUVEAU (nouvelle boutique)
[[r2_buckets]]
binding = "R2"
bucket_name = "boutique-shop-2-media"  # ← Nom créé à l'étape 3.1
```

### 4.2 Modifier `worker/index.js`

**Trouver la ligne** (environ ligne 283) :
```javascript
// ANCIEN
const url = `https://pub-53af7ff6cf154e87af25e68525a4bf74.r2.dev/${filename}`

// NOUVEAU
const url = `https://pub-VOTRE-NOUVEAU-ID-R2.r2.dev/${filename}`
```

**⚠️ Remplacez par l'URL R2 obtenue à l'étape 3.2**

### 4.3 Créer `.dev.vars` (Développement Local)

```bash
# Créer le fichier
cat > .dev.vars << 'EOF'
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=VotreMotDePasse123
EOF
```

### 4.4 Configurer les Variables de Production

```bash
# Ajouter les variables secrètes au Worker
wrangler secret put DEFAULT_ADMIN_USERNAME
# Tapez : admin

wrangler secret put DEFAULT_ADMIN_PASSWORD
# Tapez : VotreMotDePasse123
```

---

## 📋 ÉTAPE 5 : DÉPLOYER LE WORKER

### 5.1 Déployer

```bash
# Déployer le worker sur Cloudflare
wrangler deploy
```

**Vous obtiendrez une URL du type** :
```
https://boutique-shop-2.VOTRE-USERNAME.workers.dev
```

**⚠️ NOTEZ cette URL Worker !**

### 5.2 Initialiser la Base de Données

```bash
# Appeler l'endpoint /api/init pour créer les données par défaut
curl https://boutique-shop-2.VOTRE-USERNAME.workers.dev/api/init
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Database initialized"
}
```

### 5.3 Vérifier

```bash
# Vérifier les settings
curl https://boutique-shop-2.VOTRE-USERNAME.workers.dev/api/settings

# Devrait retourner :
{
  "general": {
    "shopName": "Ma Boutique",
    ...
  }
}
```

---

## 📋 ÉTAPE 6 : CONFIGURER LE FRONTEND

### 6.1 Modifier `.env.local` (Développement Local)

```bash
# Créer le fichier
cat > .env.local << 'EOF'
VITE_API_URL=https://boutique-shop-2.VOTRE-USERNAME.workers.dev
EOF
```

### 6.2 Tester Localement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:5173
```

**Vérifier** :
- ✅ La page d'accueil s'affiche
- ✅ `/admin/login` fonctionne (admin / VotreMotDePasse123)
- ✅ Vous pouvez ajouter des produits

---

## 📋 ÉTAPE 7 : DÉPLOYER SUR VERCEL

### 7.1 Importer le Projet sur Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New Project"**
3. Importez le **nouveau dépôt GitHub** créé à l'étape 1
4. Configurez le nom du projet : `boutique-shop-2`

### 7.2 Configurer les Variables d'Environnement

**⚠️ CRUCIAL : Ajouter cette variable**

Dans **Vercel → Project Settings → Environment Variables** :

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_URL` | `https://boutique-shop-2.VOTRE-USERNAME.workers.dev` | Production, Preview, Development |

**⚠️ L'URL doit correspondre à votre NOUVEAU Worker !**

### 7.3 Redéployer

```bash
# Sur Vercel, cliquez sur "Deployments"
# Puis "Redeploy" sur le dernier déploiement
# OU poussez un commit :
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 7.4 Vérifier le Déploiement

Ouvrez l'URL Vercel (ex: `https://boutique-shop-2.vercel.app`)

**Vérifier** :
- ✅ La page d'accueil s'affiche
- ✅ `/admin/login` fonctionne
- ✅ Les produits s'affichent
- ✅ Les images/vidéos fonctionnent

---

## 📋 ÉTAPE 8 : PERSONNALISER LA NOUVELLE BOUTIQUE

### 8.1 Se Connecter à l'Admin

```
https://boutique-shop-2.vercel.app/admin/login

Username : admin
Password : VotreMotDePasse123
```

### 8.2 Configurer les Paramètres

**Admin → Paramètres → Général**
- Nom de la boutique : `Mon Nouveau Shop`
- Titre Hero : `Bienvenue sur Mon Nouveau Shop`
- Sous-titre : `La meilleure sélection de produits`

**Admin → Paramètres → Socials**
- WhatsApp : `https://wa.me/VOTRE-NUMERO`
- Instagram : `https://instagram.com/VOTRE-COMPTE`
- Telegram : `https://t.me/VOTRE-COMPTE`

**Admin → Paramètres → Commandes**
- Lien de commande : `https://wa.me/VOTRE-NUMERO`

### 8.3 Ajouter des Catégories

**Admin → Catégories → Ajouter**
- Créez vos catégories personnalisées

### 8.4 Ajouter des Farms

**Admin → Farms → Ajouter**
- Créez vos farms personnalisées

### 8.5 Ajouter des Produits

**Admin → Produits → Ajouter**
- Ajoutez vos produits avec photos/vidéos

---

## ✅ CHECKLIST FINALE

Avant de lancer la nouvelle boutique, vérifiez :

### Base de Données
- [ ] Nouvelle base D1 créée
- [ ] Tables initialisées (5 tables)
- [ ] `/api/init` appelé et fonctionnel

### Worker Cloudflare
- [ ] `wrangler.toml` mis à jour (name, database_id, bucket_name)
- [ ] `worker/index.js` mis à jour (URL R2)
- [ ] Variables secrètes configurées (USERNAME, PASSWORD)
- [ ] Worker déployé
- [ ] API testée (`/api/settings` retourne des données)

### Bucket R2
- [ ] Nouveau bucket créé
- [ ] Bucket rendu public
- [ ] URL R2 notée et mise dans `worker/index.js`

### Frontend Vercel
- [ ] Nouveau dépôt GitHub créé
- [ ] `VITE_API_URL` configurée sur Vercel
- [ ] Déploiement réussi
- [ ] Site accessible
- [ ] Admin accessible

### Configuration
- [ ] Nom de la boutique changé
- [ ] Logo/images personnalisés
- [ ] Réseaux sociaux configurés
- [ ] Lien de commande configuré

---

## 🔐 SÉCURITÉ

### Cloudflare Access (Optionnel)

**⚠️ NE PAS activer Cloudflare Access sur le Worker !**

Cela bloquerait l'accès public à l'API et casserait le site.

Si vous voulez protéger l'admin :
- Utilisez les identifiants (admin/password)
- Changez le mot de passe par défaut
- Utilisez un mot de passe fort

### Changer le Mot de Passe Admin

```bash
# Mettre à jour la variable secrète
wrangler secret put DEFAULT_ADMIN_PASSWORD
# Tapez : VotreNouveauMotDePasseTresSecurise123!
```

---

## 🆘 PROBLÈMES COURANTS

### 1. "SyntaxError: Unexpected token '<'"

**Cause** : `VITE_API_URL` non configurée sur Vercel

**Solution** :
1. Vercel → Project Settings → Environment Variables
2. Ajouter `VITE_API_URL` = URL du Worker
3. Redéployer

### 2. "Products not found" / Page vide

**Cause** : `/api/init` pas appelé

**Solution** :
```bash
curl https://VOTRE-WORKER.workers.dev/api/init
```

### 3. Images ne s'affichent pas

**Cause** : URL R2 incorrecte dans `worker/index.js`

**Solution** :
1. Vérifier l'URL R2 publique
2. Mettre à jour `worker/index.js` ligne 283
3. Redéployer le worker : `wrangler deploy`

### 4. "Database not found"

**Cause** : `database_id` incorrect dans `wrangler.toml`

**Solution** :
1. Lister vos bases : `wrangler d1 list`
2. Copier le bon `database_id`
3. Mettre à jour `wrangler.toml`
4. Redéployer

---

## 📊 RÉCAPITULATIF DES URLS

Pour chaque nouvelle boutique, vous aurez :

| Service | URL Exemple |
|---------|-------------|
| **Worker Cloudflare** | `https://boutique-shop-2.VOTRE-USERNAME.workers.dev` |
| **Bucket R2** | `https://pub-XXXXXXXXX.r2.dev/` |
| **Site Vercel** | `https://boutique-shop-2.vercel.app` |
| **Admin** | `https://boutique-shop-2.vercel.app/admin` |

**Chaque boutique est 100% indépendante !**

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant une **nouvelle boutique complètement séparée** :
- ✅ Base de données indépendante
- ✅ Worker indépendant
- ✅ Stockage R2 indépendant
- ✅ Déploiement Vercel indépendant

**Répétez ce guide pour créer autant de boutiques que vous voulez !**

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :
1. Vérifiez la **Checklist Finale**
2. Consultez **Problèmes Courants**
3. Vérifiez les logs : `wrangler tail`
4. Vérifiez la console navigateur (F12)
