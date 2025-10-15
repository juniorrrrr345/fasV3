# 🚀 Déployer les Corrections sur Vercel

## 📍 Où vous êtes actuellement

Vous êtes connecté au panel admin, probablement en **local** (localhost:5173).

Pour que ça marche sur **Vercel** (votre site en production), suivez ces étapes :

---

## 🔧 ÉTAPE PAR ÉTAPE

### 1. Récupérer les Corrections

Sur votre PC, ouvrez **PowerShell** dans le dossier du projet :

```powershell
cd C:\Users\PC\Documents\THEGD33V3
```

### 2. Vérifier la Branche Actuelle

```powershell
git status
```

Vous devriez voir : `On branch cursor/debug-admin-panel-json-errors-9e80`

### 3. Récupérer les Dernières Modifications

```powershell
git pull origin cursor/debug-admin-panel-json-errors-9e80
```

### 4. Vérifier les Fichiers Modifiés

```powershell
git status
```

Si vous voyez des fichiers modifiés (vercel.json, etc.), ajoutez-les :

```powershell
git add .
```

### 5. Créer un Commit

```powershell
git commit -m "Fix vercel config and apply corrections"
```

### 6. Pousser sur GitHub

```powershell
git push origin cursor/debug-admin-panel-json-errors-9e80
```

---

## 🌐 Sur Vercel

### Option A : Redéploiement Automatique

1. Vercel détecte automatiquement le push
2. Attendez 1-2 minutes
3. Votre site sera redéployé automatiquement

### Option B : Redéploiement Manuel

1. Allez sur **https://vercel.com**
2. Connectez-vous
3. Trouvez votre projet **THEGD33V3**
4. Cliquez sur **Deployments**
5. Cliquez sur **Redeploy** pour le dernier déploiement

---

## 📋 Si Vercel ne Redéploie Pas Automatiquement

### 1. Merger la Branche

Il faut peut-être merger votre branche dans `main` :

```powershell
# Aller sur la branche main
git checkout main

# Merger les corrections
git merge cursor/debug-admin-panel-json-errors-9e80

# Pousser
git push origin main
```

### 2. Vérifier la Configuration Vercel

1. Allez sur **Vercel Dashboard**
2. Projet **THEGD33V3** → **Settings**
3. Vérifiez que la **branche** à déployer est bien configurée

---

## ✅ VÉRIFIER QUE ÇA MARCHE

Une fois déployé sur Vercel :

1. **Allez sur votre site Vercel** :
   ```
   https://votre-site.vercel.app
   ```

2. **Testez le panel admin** :
   ```
   https://votre-site.vercel.app/admin/login
   ```

3. **Connectez-vous** :
   - Username : `admin`
   - Password : `admin123`

4. **Vérifiez qu'il n'y a plus d'erreurs JSON** dans la console (F12)

---

## 🆘 Si vous avez encore des erreurs

### Vérifier les Variables d'Environnement

Sur **Vercel Dashboard** :

1. Projet **THEGD33V3** → **Settings** → **Environment Variables**
2. Ajoutez (si pas déjà fait) :
   ```
   VITE_API_URL = https://thegd33.calitek-junior.workers.dev
   ```
3. **Redéployez** après avoir ajouté la variable

---

## 📊 Résumé des Commandes

```powershell
# Dans le dossier du projet
cd C:\Users\PC\Documents\THEGD33V3

# Récupérer les corrections
git pull origin cursor/debug-admin-panel-json-errors-9e80

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Apply fixes for Vercel"

# Push
git push origin cursor/debug-admin-panel-json-errors-9e80
```

Puis attendre que Vercel redéploie (1-2 minutes).

---

## 🎯 ALTERNATIVE RAPIDE

Si vous voulez juste tester :

1. Sur **Vercel Dashboard**
2. Allez dans votre projet
3. Cliquez sur **Deployments**
4. Trouvez le dernier déploiement
5. Cliquez sur les 3 points **⋮**
6. Cliquez sur **Redeploy**

---

**C'est tout ! Vercel redéploiera votre site avec les corrections. 🚀**
